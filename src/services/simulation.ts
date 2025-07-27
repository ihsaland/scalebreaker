import type { ServerNode, Connection, SimulationMetrics, ArchitectureState } from '../types/architecture';

const calculateServerThroughput = (server: ServerNode): number => {
  const { resources } = server;
  // Calculate theoretical max throughput based on resources
  const cpuThroughput = resources.cpu * resources.cpuCores * 1000; // ops/sec per core
  const memoryThroughput = resources.memory * 1000; // ops/sec per GB
  const networkThroughput = resources.networkBandwidth * 100; // ops/sec per Mbps

  // Return the minimum of all throughputs (bottleneck)
  return Math.min(cpuThroughput, memoryThroughput, networkThroughput);
};

const calculateConnectionThroughput = (connection: Connection): number => {
  return connection.bandwidth * 100; // ops/sec per Mbps
};

const calculateLoadDistribution = (nodes: ServerNode[], targetThroughput: number): Record<string, number> => {
  const distribution: Record<string, number> = {};
  
  // Define load multipliers based on node type
  const loadMultipliers: Record<string, number> = {
    'lb': 1.2,    // Load balancers handle more traffic
    'gateway': 1.3, // API gateways are high-traffic
    'app': 1.0,   // Application servers get standard load
    'micro': 0.8,  // Microservices get lighter load
    'db': 0.6,    // Databases get moderate load
    'cache': 0.4,  // Caches get lighter load
    'mq': 0.7,    // Message queues get moderate load
    'cdn': 0.3,   // CDNs get very light load
    'asg': 1.1,   // Auto-scaling groups get slightly more
    'dr': 0.2,    // Disaster recovery gets minimal load
  };

  // Calculate total multiplier for all nodes
  const totalMultiplier = nodes.reduce((sum, node) => {
    return sum + (loadMultipliers[node.type] || 1.0);
  }, 0);

  // Distribute load based on node types
  nodes.forEach(node => {
    const multiplier = loadMultipliers[node.type] || 1.0;
    const nodeLoad = (targetThroughput * multiplier) / totalMultiplier;
    distribution[node.id] = nodeLoad;
  });

  return distribution;
};

export const simulateArchitecture = (
  state: ArchitectureState,
  targetThroughput: number
): ArchitectureState => {
  const { nodes, connections } = state;
  let currentThroughput = 0;
  const bottleneckNodes: string[] = [];
  let systemHealth = 100;

  // Calculate individual node throughputs with realistic load distribution
  const loadDistribution = calculateLoadDistribution(nodes, targetThroughput);
  
  nodes.forEach(node => {
    const maxNodeThroughput = calculateServerThroughput(node);
    const nodeLoad = loadDistribution[node.id] || 0;
    const loadPercentage = (nodeLoad / maxNodeThroughput) * 100;

    node.currentLoad = Math.min(loadPercentage, 100); // Cap at 100% for display
    node.maxThroughput = maxNodeThroughput;
    node.isHealthy = loadPercentage <= 100;

    if (loadPercentage > 100) {
      bottleneckNodes.push(node.id);
      systemHealth -= (loadPercentage - 100) / nodes.length;
    }
  });

  // Calculate connection throughputs
  connections.forEach(connection => {
    const maxConnectionThroughput = calculateConnectionThroughput(connection);
    const connectionLoad = targetThroughput / connections.length;
    const loadPercentage = (connectionLoad / maxConnectionThroughput) * 100;

    connection.currentLoad = Math.min(loadPercentage, 100); // Cap at 100% for display

    if (loadPercentage > 100) {
      bottleneckNodes.push(connection.id);
      systemHealth -= (loadPercentage - 100) / connections.length;
    }
  });

  // Calculate total achievable throughput
  const maxAchievableThroughput = Math.min(
    ...nodes.map(node => node.maxThroughput),
    ...connections.map(conn => calculateConnectionThroughput(conn))
  );

  return {
    ...state,
    metrics: {
      totalThroughput: targetThroughput,
      systemHealth: Math.max(0, systemHealth),
      bottleneckNodes,
      maxAchievableThroughput,
      latency: 50, // Default latency in milliseconds
      reliability: Math.max(0, systemHealth) // Reliability based on system health
    }
  };
}; 