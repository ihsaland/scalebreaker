export interface ServerResources {
  cpu: number;
  cpuCores: number;
  memory: number; // in GB
  networkBandwidth: number; // in Mbps
}

export type NodeType = 'lb' | 'app' | 'db' | 'cache' | 'cdn' | 'mq' | 'micro' | 'dr' | 'gateway' | 'asg';

export interface ServerNode {
  id: string;
  type: NodeType;
  resources: ServerResources;
  currentLoad: number;
  maxThroughput: number;
  isHealthy: boolean;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  bandwidth: number; // in Mbps
  currentLoad: number;
}

export interface SimulationMetrics {
  totalThroughput: number;
  systemHealth: number;
  bottleneckNodes: string[];
  maxAchievableThroughput: number;
  latency: number;      // Average latency in milliseconds
  reliability: number;  // System reliability percentage
}

export interface ArchitectureState {
  nodes: ServerNode[];
  connections: Connection[];
  metrics: SimulationMetrics;
} 