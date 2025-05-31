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

export const simulateArchitecture = (
  state: ArchitectureState,
  targetThroughput: number
): ArchitectureState => {
  const { nodes, connections } = state;
  let currentThroughput = 0;
  const bottleneckNodes: string[] = [];
  let systemHealth = 100;

  // Calculate individual node throughputs
  nodes.forEach(node => {
    const maxNodeThroughput = calculateServerThroughput(node);
    const nodeLoad = (targetThroughput / nodes.length);
    const loadPercentage = (nodeLoad / maxNodeThroughput) * 100;

    node.currentLoad = nodeLoad;
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

    connection.currentLoad = connectionLoad;

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
      maxAchievableThroughput
    }
  };
}; 