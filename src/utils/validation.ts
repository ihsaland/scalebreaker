import type { Node, Edge, NodeType } from '../types/architecture';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const isValidNodeType = (type: string): type is NodeType => {
  const validTypes: NodeType[] = ['lb', 'app', 'db', 'cache', 'cdn', 'mq', 'micro', 'dr', 'gateway'];
  return validTypes.includes(type as NodeType);
};

export const validateNodeConnections = (
  node: Node,
  edges: Edge[],
  nodes: Node[],
  entryPoint: Node | null
): { errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const incomingConnections = edges.filter(edge => edge.target === node.id).length;
  const outgoingConnections = edges.filter(edge => edge.source === node.id).length;

  switch (node.data.type) {
    case 'lb':
    case 'gateway':
      const hasValidIncoming = edges.some(edge => 
        (edge.source === 'user' || edge.source === entryPoint?.id) && 
        edge.target === node.id
      );
      if (!hasValidIncoming) {
        errors.push(`${node.data.serverType} must have incoming connection from user or entry point`);
      }
      if (outgoingConnections === 0) {
        errors.push(`${node.data.serverType} must have outgoing connections`);
      }
      const lbOutgoingToApps = edges.filter(edge => 
        edge.source === node.id && 
        nodes.some(n => n.id === edge.target && (n.data.type === 'app' || n.data.type === 'micro'))
      ).length;
      if (lbOutgoingToApps < 2) {
        warnings.push(`${node.data.serverType} should connect to multiple application servers for redundancy`);
      }
      break;

    case 'app':
    case 'micro':
      if (incomingConnections === 0) {
        errors.push(`${node.data.serverType} must have incoming connections`);
      }
      const hasCacheConnection = edges.some(edge => 
        edge.source === node.id && 
        nodes.some(n => n.id === edge.target && n.data.type === 'cache')
      );
      const hasDbConnection = edges.some(edge => 
        edge.source === node.id && 
        nodes.some(n => n.id === edge.target && n.data.type === 'db')
      );
      if (!hasCacheConnection) {
        warnings.push(`${node.data.serverType} should connect to a cache for better performance`);
      }
      if (!hasDbConnection) {
        errors.push(`${node.data.serverType} must connect to a database`);
      }
      break;

    case 'db':
      if (incomingConnections === 0) {
        errors.push(`${node.data.serverType} must have incoming connections`);
      }
      if (outgoingConnections > 0) {
        errors.push(`${node.data.serverType} should not have outgoing connections`);
      }
      const dbCount = nodes.filter(n => n.data.type === 'db').length;
      if (dbCount < 2) {
        warnings.push('Consider adding database replication for high availability');
      }
      break;

    case 'cache':
      if (incomingConnections === 0) {
        errors.push(`${node.data.serverType} must have incoming connections`);
      }
      if (outgoingConnections > 0) {
        warnings.push(`${node.data.serverType} typically should not have outgoing connections`);
      }
      const cacheCount = nodes.filter(n => n.data.type === 'cache').length;
      if (cacheCount < 2) {
        warnings.push('Consider adding cache replication for high availability');
      }
      break;

    case 'mq':
      if (incomingConnections === 0) {
        errors.push(`${node.data.serverType} must have incoming connections`);
      }
      if (outgoingConnections === 0) {
        warnings.push(`${node.data.serverType} typically should have outgoing connections`);
      }
      const mqCount = nodes.filter(n => n.data.type === 'mq').length;
      if (mqCount < 2) {
        warnings.push('Consider adding message queue replication for high availability');
      }
      break;
  }

  return { errors, warnings };
};

export const validateArchitecture = (
  nodes: Node[],
  edges: Edge[],
  entryPoint: Node | null
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let isValid = true;

  // Check for entry point
  if (!entryPoint) {
    errors.push('No entry point defined');
    isValid = false;
  }

  // Check for isolated nodes
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  // Production Architecture Requirements
  const hasLoadBalancer = nodes.some(node => node.data.type === 'lb');
  const hasDatabase = nodes.some(node => node.data.type === 'db');
  const hasCache = nodes.some(node => node.data.type === 'cache');
  const hasMultipleAppServers = nodes.filter(node => 
    node.data.type === 'app' || node.data.type === 'micro'
  ).length > 1;

  // Validate each node
  nodes.forEach(node => {
    if (!connectedNodes.has(node.id) && node.id !== 'user') {
      const nodeName = node.data.serverType || node.data.type;
      errors.push(`Node "${nodeName}" is isolated`);
      isValid = false;
    }

    const nodeValidation = validateNodeConnections(node, edges, nodes, entryPoint);
    errors.push(...nodeValidation.errors);
    warnings.push(...nodeValidation.warnings);
    if (nodeValidation.errors.length > 0) {
      isValid = false;
    }
  });

  // Production Requirements Validation
  if (!hasLoadBalancer) {
    errors.push('Production architecture must include a load balancer for high availability');
    isValid = false;
  }

  if (!hasDatabase) {
    errors.push('Production architecture must include a database for data persistence');
    isValid = false;
  }

  if (!hasCache) {
    warnings.push('Consider adding a cache layer for improved performance');
  }

  if (!hasMultipleAppServers) {
    warnings.push('Consider adding multiple application servers for redundancy');
  }

  // Check for cycles
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target) && hasCycle(edge.target)) {
          return true;
        } else if (recursionStack.has(edge.target)) {
          return true;
        }
      }
    }
    recursionStack.delete(nodeId);
    return false;
  };

  if (entryPoint && hasCycle(entryPoint.id)) {
    warnings.push('Architecture contains cycles');
  }

  return { isValid, errors, warnings };
}; 