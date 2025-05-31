import type { ServerResources, ArchitectureState } from '../types/architecture';

export interface CostEstimate {
  monthly: number;
  hourly: number;
  breakdown: {
    compute: number;
    storage: number;
    network: number;
    maintenance: number;
  };
}

export interface BestPractice {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface IndustryOptimization {
  industry: string;
  recommendations: string[];
  compliance?: string[];
}

export interface ArchitectureTemplate {
  name: string;
  description: string;
  recommendedThroughput: number;
  complexity: 'basic' | 'intermediate' | 'advanced';
  category: string;
  costEstimate: CostEstimate;
  bestPractices: BestPractice[];
  industryOptimizations: IndustryOptimization[];
  performanceCharacteristics: {
    latency: number; // in milliseconds
    scalability: 'high' | 'medium' | 'low';
    reliability: number; // percentage
    maintenanceComplexity: 'high' | 'medium' | 'low';
  };
  initialState: ArchitectureState;
}

const defaultServerResources: ServerResources = {
  cpu: 2.4,
  cpuCores: 4,
  memory: 16,
  networkBandwidth: 1000,
};

const highPerformanceServerResources: ServerResources = {
  cpu: 3.6,
  cpuCores: 8,
  memory: 32,
  networkBandwidth: 2500,
};

const lowLatencyServerResources: ServerResources = {
  cpu: 2.8,
  cpuCores: 6,
  memory: 24,
  networkBandwidth: 5000,
};

const storageServerResources: ServerResources = {
  cpu: 2.4,
  cpuCores: 4,
  memory: 64,
  networkBandwidth: 2000,
};

const cacheServerResources: ServerResources = {
  cpu: 2.4,
  cpuCores: 4,
  memory: 32,
  networkBandwidth: 2000,
};

const edgeServerResources: ServerResources = {
  cpu: 2.0,
  cpuCores: 2,
  memory: 8,
  networkBandwidth: 500,
};

const mediaServerResources: ServerResources = {
  cpu: 3.2,
  cpuCores: 6,
  memory: 32,
  networkBandwidth: 3000,
};

const securityServerResources: ServerResources = {
  cpu: 2.8,
  cpuCores: 4,
  memory: 16,
  networkBandwidth: 2000,
};

const analyticsServerResources: ServerResources = {
  cpu: 3.6,
  cpuCores: 8,
  memory: 64,
  networkBandwidth: 2000,
};

const iotServerResources: ServerResources = {
  cpu: 2.4,
  cpuCores: 4,
  memory: 16,
  networkBandwidth: 1000,
};

const gamingServerResources: ServerResources = {
  cpu: 3.6,
  cpuCores: 8,
  memory: 32,
  networkBandwidth: 5000,
};

const ecommerceServerResources: ServerResources = {
  cpu: 3.2,
  cpuCores: 6,
  memory: 24,
  networkBandwidth: 2000,
};

export const architectureTemplates: ArchitectureTemplate[] = [
  // Basic Templates
  {
    name: "Single Server",
    description: "A simple single-server setup for basic applications",
    recommendedThroughput: 1000,
    complexity: 'basic',
    category: 'Web Applications',
    costEstimate: {
      monthly: 100,
      hourly: 0.14,
      breakdown: {
        compute: 60,
        storage: 20,
        network: 10,
        maintenance: 10,
      },
    },
    bestPractices: [
      {
        title: "Regular Backups",
        description: "Implement automated daily backups to prevent data loss",
        impact: 'high',
      },
      {
        title: "Monitoring Setup",
        description: "Set up basic monitoring for CPU, memory, and disk usage",
        impact: 'medium',
      },
      {
        title: "Security Updates",
        description: "Keep the system updated with the latest security patches",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "Small Business",
        recommendations: [
          "Use managed hosting for reduced maintenance overhead",
          "Implement basic caching for improved performance",
        ],
      },
      {
        industry: "Development",
        recommendations: [
          "Set up CI/CD pipeline for automated deployments",
          "Use containerization for consistent environments",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 50,
      scalability: 'low',
      reliability: 99.9,
      maintenanceComplexity: 'low',
    },
    initialState: {
      nodes: [
        {
          id: "server_1",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Basic Load Balancer",
    description: "Simple two-tier architecture with a load balancer and two application servers",
    recommendedThroughput: 2000,
    complexity: 'basic',
    category: 'Web Applications',
    costEstimate: {
      monthly: 300,
      hourly: 0.42,
      breakdown: {
        compute: 180,
        storage: 60,
        network: 30,
        maintenance: 30,
      },
    },
    bestPractices: [
      {
        title: "Health Checks",
        description: "Configure load balancer health checks for automatic failover",
        impact: 'high',
      },
      {
        title: "Session Management",
        description: "Implement sticky sessions or distributed session storage",
        impact: 'medium',
      },
      {
        title: "SSL Termination",
        description: "Handle SSL at the load balancer level for better performance",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "E-commerce",
        recommendations: [
          "Implement CDN for static content delivery",
          "Use session affinity for shopping cart consistency",
        ],
      },
      {
        industry: "Media",
        recommendations: [
          "Configure caching headers for static content",
          "Implement rate limiting for API endpoints",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 40,
      scalability: 'medium',
      reliability: 99.95,
      maintenanceComplexity: 'medium',
    },
    initialState: {
      nodes: [
        {
          id: "lb_1",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "app_1",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "app_2",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "lb_1",
          target: "app_1",
          bandwidth: 1000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "lb_1",
          target: "app_2",
          bandwidth: 1000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  // Intermediate Templates
  {
    name: "Microservices Cluster",
    description: "A microservices architecture with 4 services and a gateway",
    recommendedThroughput: 5000,
    complexity: 'intermediate',
    category: 'Microservices',
    costEstimate: {
      monthly: 800,
      hourly: 1.12,
      breakdown: {
        compute: 400,
        storage: 200,
        network: 100,
        maintenance: 100,
      },
    },
    bestPractices: [
      {
        title: "Service Discovery",
        description: "Implement service discovery for dynamic service registration",
        impact: 'high',
      },
      {
        title: "Circuit Breaking",
        description: "Add circuit breakers to prevent cascading failures",
        impact: 'high',
      },
      {
        title: "Distributed Tracing",
        description: "Implement distributed tracing for better debugging",
        impact: 'medium',
      },
    ],
    industryOptimizations: [
      {
        industry: "FinTech",
        recommendations: [
          "Implement strict security controls between services",
          "Add audit logging for all service interactions",
        ],
        compliance: ["PCI-DSS", "SOC2"],
      },
      {
        industry: "Healthcare",
        recommendations: [
          "Ensure HIPAA compliance for data handling",
          "Implement strict access controls",
        ],
        compliance: ["HIPAA"],
      },
    ],
    performanceCharacteristics: {
      latency: 30,
      scalability: 'high',
      reliability: 99.99,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "gateway",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "service_1",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "service_2",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "service_3",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "service_4",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "gateway",
          target: "service_1",
          bandwidth: 1000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "gateway",
          target: "service_2",
          bandwidth: 1000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "gateway",
          target: "service_3",
          bandwidth: 1000,
          currentLoad: 0,
        },
        {
          id: "conn_4",
          source: "gateway",
          target: "service_4",
          bandwidth: 1000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Caching Layer",
    description: "A three-tier architecture with load balancer, application servers, and a caching layer",
    recommendedThroughput: 4000,
    complexity: 'intermediate',
    category: 'Web Applications',
    costEstimate: {
      monthly: 600,
      hourly: 0.84,
      breakdown: {
        compute: 300,
        storage: 150,
        network: 100,
        maintenance: 50,
      },
    },
    bestPractices: [
      {
        title: "Cache Invalidation",
        description: "Implement proper cache invalidation strategies",
        impact: 'high',
      },
      {
        title: "Cache Distribution",
        description: "Use consistent hashing for cache distribution",
        impact: 'high',
      },
      {
        title: "Cache Monitoring",
        description: "Monitor cache hit rates and memory usage",
        impact: 'medium',
      },
    ],
    industryOptimizations: [
      {
        industry: "E-commerce",
        recommendations: [
          "Cache product catalogs and inventory data",
          "Implement cache warming for popular products",
        ],
      },
      {
        industry: "Content Delivery",
        recommendations: [
          "Use edge caching for static content",
          "Implement cache purging for content updates",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 35,
      scalability: 'medium',
      reliability: 99.95,
      maintenanceComplexity: 'medium',
    },
    initialState: {
      nodes: [
        {
          id: "lb_1",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "app_1",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "app_2",
          type: "server",
          resources: defaultServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "cache_1",
          type: "server",
          resources: cacheServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "cache_2",
          type: "server",
          resources: cacheServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "lb_1",
          target: "app_1",
          bandwidth: 1000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "lb_1",
          target: "app_2",
          bandwidth: 1000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "app_1",
          target: "cache_1",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_4",
          source: "app_2",
          target: "cache_2",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Healthcare Data Platform",
    description: "HIPAA-compliant architecture for healthcare data processing and storage",
    recommendedThroughput: 3000,
    complexity: 'advanced',
    category: 'Healthcare',
    costEstimate: {
      monthly: 2500,
      hourly: 3.50,
      breakdown: {
        compute: 1000,
        storage: 800,
        network: 400,
        maintenance: 300,
      },
    },
    bestPractices: [
      {
        title: "Data Encryption",
        description: "Implement end-to-end encryption for all data",
        impact: 'high',
      },
      {
        title: "Audit Logging",
        description: "Maintain comprehensive audit logs of all data access",
        impact: 'high',
      },
      {
        title: "Backup Strategy",
        description: "Implement redundant backups with encryption",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "Healthcare",
        recommendations: [
          "Implement HL7 FHIR integration",
          "Set up HIPAA-compliant logging and monitoring",
          "Configure role-based access control",
        ],
        compliance: ["HIPAA", "HITECH", "GDPR"],
      },
    ],
    performanceCharacteristics: {
      latency: 45,
      scalability: 'high',
      reliability: 99.99,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "api_gateway",
          type: "server",
          resources: securityServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "data_processor",
          type: "server",
          resources: analyticsServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "storage_primary",
          type: "server",
          resources: storageServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "storage_backup",
          type: "server",
          resources: storageServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "api_gateway",
          target: "data_processor",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "data_processor",
          target: "storage_primary",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "data_processor",
          target: "storage_backup",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Media Streaming Platform",
    description: "High-performance architecture for video streaming and content delivery",
    recommendedThroughput: 12000,
    complexity: 'advanced',
    category: 'Media',
    costEstimate: {
      monthly: 4000,
      hourly: 5.60,
      breakdown: {
        compute: 2000,
        storage: 1000,
        network: 800,
        maintenance: 200,
      },
    },
    bestPractices: [
      {
        title: "CDN Integration",
        description: "Implement multi-region CDN for content delivery",
        impact: 'high',
      },
      {
        title: "Adaptive Bitrate",
        description: "Configure adaptive bitrate streaming",
        impact: 'high',
      },
      {
        title: "Load Distribution",
        description: "Use geographic load balancing",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "Streaming",
        recommendations: [
          "Implement HLS/DASH streaming protocols",
          "Configure video transcoding pipeline",
          "Set up real-time analytics for viewer metrics",
        ],
      },
      {
        industry: "Gaming",
        recommendations: [
          "Optimize for low-latency streaming",
          "Implement game state synchronization",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 15,
      scalability: 'high',
      reliability: 99.99,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "ingest_server",
          type: "server",
          resources: mediaServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "transcoder_1",
          type: "server",
          resources: mediaServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "transcoder_2",
          type: "server",
          resources: mediaServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "edge_1",
          type: "server",
          resources: edgeServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "edge_2",
          type: "server",
          resources: edgeServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "ingest_server",
          target: "transcoder_1",
          bandwidth: 3000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "ingest_server",
          target: "transcoder_2",
          bandwidth: 3000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "transcoder_1",
          target: "edge_1",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_4",
          source: "transcoder_2",
          target: "edge_2",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  // Advanced Templates
  {
    name: "High-Performance Computing",
    description: "A cluster optimized for high-performance computing with powerful servers",
    recommendedThroughput: 10000,
    complexity: 'advanced',
    category: 'Data Processing',
    costEstimate: {
      monthly: 2000,
      hourly: 2.80,
      breakdown: {
        compute: 1200,
        storage: 400,
        network: 200,
        maintenance: 200,
      },
    },
    bestPractices: [
      {
        title: "Job Scheduling",
        description: "Implement efficient job scheduling and resource allocation",
        impact: 'high',
      },
      {
        title: "Data Locality",
        description: "Optimize data placement for reduced network transfer",
        impact: 'high',
      },
      {
        title: "Fault Tolerance",
        description: "Implement checkpointing and recovery mechanisms",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "Scientific Computing",
        recommendations: [
          "Optimize for floating-point operations",
          "Implement MPI for inter-node communication",
        ],
      },
      {
        industry: "Machine Learning",
        recommendations: [
          "Configure GPU acceleration where applicable",
          "Implement distributed training patterns",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 20,
      scalability: 'high',
      reliability: 99.95,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "master",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "worker_1",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "worker_2",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "worker_3",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "master",
          target: "worker_1",
          bandwidth: 2500,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "master",
          target: "worker_2",
          bandwidth: 2500,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "master",
          target: "worker_3",
          bandwidth: 2500,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Low-Latency Trading System",
    description: "A high-frequency trading system optimized for minimal latency",
    recommendedThroughput: 15000,
    complexity: 'advanced',
    category: 'Financial Systems',
    costEstimate: {
      monthly: 5000,
      hourly: 7.00,
      breakdown: {
        compute: 2500,
        storage: 1000,
        network: 1000,
        maintenance: 500,
      },
    },
    bestPractices: [
      {
        title: "Network Optimization",
        description: "Use dedicated network paths and optimized routing",
        impact: 'high',
      },
      {
        title: "Memory Management",
        description: "Implement zero-copy operations and memory pooling",
        impact: 'high',
      },
      {
        title: "Clock Synchronization",
        description: "Use PTP for precise time synchronization",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "High-Frequency Trading",
        recommendations: [
          "Colocate with exchange servers",
          "Use FPGA acceleration for order processing",
        ],
        compliance: ["MiFID II", "SEC Regulations"],
      },
      {
        industry: "Market Making",
        recommendations: [
          "Implement risk management controls",
          "Use predictive analytics for market making",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 1,
      scalability: 'high',
      reliability: 99.999,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "market_data",
          type: "server",
          resources: lowLatencyServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "order_processor",
          type: "server",
          resources: lowLatencyServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "risk_engine",
          type: "server",
          resources: lowLatencyServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "market_data",
          target: "order_processor",
          bandwidth: 5000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "order_processor",
          target: "risk_engine",
          bandwidth: 5000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Big Data Pipeline",
    description: "A distributed system for processing large volumes of data with storage and processing nodes",
    recommendedThroughput: 8000,
    complexity: 'advanced',
    category: 'Data Processing',
    costEstimate: {
      monthly: 3000,
      hourly: 4.20,
      breakdown: {
        compute: 1500,
        storage: 1000,
        network: 300,
        maintenance: 200,
      },
    },
    bestPractices: [
      {
        title: "Data Partitioning",
        description: "Implement efficient data partitioning strategies",
        impact: 'high',
      },
      {
        title: "Stream Processing",
        description: "Use stream processing for real-time data analysis",
        impact: 'high',
      },
      {
        title: "Data Retention",
        description: "Implement tiered storage and data lifecycle management",
        impact: 'medium',
      },
    ],
    industryOptimizations: [
      {
        industry: "IoT",
        recommendations: [
          "Implement time-series database optimization",
          "Use edge computing for data preprocessing",
        ],
      },
      {
        industry: "Analytics",
        recommendations: [
          "Optimize for OLAP workloads",
          "Implement data warehousing best practices",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 25,
      scalability: 'high',
      reliability: 99.9,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "ingest",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "processor_1",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "processor_2",
          type: "server",
          resources: highPerformanceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "storage_1",
          type: "server",
          resources: storageServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "storage_2",
          type: "server",
          resources: storageServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "ingest",
          target: "processor_1",
          bandwidth: 2500,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "ingest",
          target: "processor_2",
          bandwidth: 2500,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "processor_1",
          target: "storage_1",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_4",
          source: "processor_2",
          target: "storage_2",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "IoT Data Platform",
    description: "Scalable architecture for IoT device management and data processing",
    recommendedThroughput: 20000,
    complexity: 'advanced',
    category: 'IoT',
    costEstimate: {
      monthly: 3500,
      hourly: 4.90,
      breakdown: {
        compute: 1500,
        storage: 1000,
        network: 800,
        maintenance: 200,
      },
    },
    bestPractices: [
      {
        title: "Device Management",
        description: "Implement secure device provisioning and management",
        impact: 'high',
      },
      {
        title: "Data Ingestion",
        description: "Use message queues for reliable data ingestion",
        impact: 'high',
      },
      {
        title: "Time Series Storage",
        description: "Implement optimized time series database",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "Industrial IoT",
        recommendations: [
          "Implement OPC UA protocol support",
          "Configure real-time monitoring and alerts",
          "Set up predictive maintenance analytics",
        ],
        compliance: ["IEC 62443", "ISO 27001"],
      },
      {
        industry: "Smart Cities",
        recommendations: [
          "Implement edge computing for local processing",
          "Configure data aggregation and analytics",
          "Set up real-time traffic management",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 30,
      scalability: 'high',
      reliability: 99.99,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "device_gateway",
          type: "server",
          resources: iotServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "data_processor",
          type: "server",
          resources: analyticsServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "time_series_db",
          type: "server",
          resources: storageServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "analytics_engine",
          type: "server",
          resources: analyticsServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "device_gateway",
          target: "data_processor",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "data_processor",
          target: "time_series_db",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "time_series_db",
          target: "analytics_engine",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "Gaming Platform",
    description: "High-performance architecture for online gaming and real-time interactions",
    recommendedThroughput: 25000,
    complexity: 'advanced',
    category: 'Gaming',
    costEstimate: {
      monthly: 6000,
      hourly: 8.40,
      breakdown: {
        compute: 3000,
        storage: 1500,
        network: 1200,
        maintenance: 300,
      },
    },
    bestPractices: [
      {
        title: "Game State Sync",
        description: "Implement efficient game state synchronization",
        impact: 'high',
      },
      {
        title: "Anti-Cheat",
        description: "Deploy server-side validation and anti-cheat measures",
        impact: 'high',
      },
      {
        title: "Matchmaking",
        description: "Implement efficient matchmaking algorithms",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "MMO Games",
        recommendations: [
          "Implement sharding for world partitioning",
          "Configure real-time player synchronization",
          "Set up cross-region replication",
        ],
      },
      {
        industry: "Competitive Gaming",
        recommendations: [
          "Implement low-latency networking",
          "Configure anti-cheat systems",
          "Set up tournament management",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 5,
      scalability: 'high',
      reliability: 99.999,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "game_server",
          type: "server",
          resources: gamingServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "matchmaking",
          type: "server",
          resources: gamingServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "state_sync",
          type: "server",
          resources: gamingServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "anti_cheat",
          type: "server",
          resources: securityServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "game_server",
          target: "matchmaking",
          bandwidth: 5000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "game_server",
          target: "state_sync",
          bandwidth: 5000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "game_server",
          target: "anti_cheat",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
  {
    name: "E-commerce Platform",
    description: "High-availability architecture for online retail with real-time inventory",
    recommendedThroughput: 15000,
    complexity: 'advanced',
    category: 'E-commerce',
    costEstimate: {
      monthly: 4500,
      hourly: 6.30,
      breakdown: {
        compute: 2000,
        storage: 1500,
        network: 800,
        maintenance: 200,
      },
    },
    bestPractices: [
      {
        title: "Inventory Management",
        description: "Implement real-time inventory tracking and updates",
        impact: 'high',
      },
      {
        title: "Order Processing",
        description: "Use event-driven architecture for order processing",
        impact: 'high',
      },
      {
        title: "Payment Security",
        description: "Implement secure payment processing with fraud detection",
        impact: 'high',
      },
    ],
    industryOptimizations: [
      {
        industry: "Retail",
        recommendations: [
          "Implement real-time inventory synchronization",
          "Configure order fulfillment pipeline",
          "Set up customer analytics",
        ],
        compliance: ["PCI-DSS", "GDPR"],
      },
      {
        industry: "Marketplace",
        recommendations: [
          "Implement multi-vendor support",
          "Configure commission management",
          "Set up dispute resolution system",
        ],
      },
    ],
    performanceCharacteristics: {
      latency: 25,
      scalability: 'high',
      reliability: 99.99,
      maintenanceComplexity: 'high',
    },
    initialState: {
      nodes: [
        {
          id: "web_frontend",
          type: "server",
          resources: ecommerceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "order_processor",
          type: "server",
          resources: ecommerceServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "inventory_db",
          type: "server",
          resources: storageServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
        {
          id: "payment_processor",
          type: "server",
          resources: securityServerResources,
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
        },
      ],
      connections: [
        {
          id: "conn_1",
          source: "web_frontend",
          target: "order_processor",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_2",
          source: "order_processor",
          target: "inventory_db",
          bandwidth: 2000,
          currentLoad: 0,
        },
        {
          id: "conn_3",
          source: "order_processor",
          target: "payment_processor",
          bandwidth: 2000,
          currentLoad: 0,
        },
      ],
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
      },
    },
  },
]; 