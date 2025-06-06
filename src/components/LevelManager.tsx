import React from 'react';
import styled from '@emotion/styled';
import type { NodeType, ServerNode } from '../types/architecture';

const LevelContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 5;
  min-width: 300px;
  text-align: center;
`;

const LevelTitle = styled.h3`
  margin: 0 0 12px;
  color: #333;
  font-size: 18px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: #4a90e2;
  transition: width 0.3s ease;
`;

const Requirements = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 12px 0;
`;

const Requirement = styled.div<{ met: boolean }>`
  padding: 8px;
  background: ${props => props.met ? '#e8f5e9' : '#ffebee'};
  border-radius: 4px;
  font-size: 12px;
  color: ${props => props.met ? '#2e7d32' : '#c62828'};
`;

const LevelDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 8px 0;
`;

const NextLevelButton = styled.button`
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: #357abd;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const AchievementBadge = styled.div<{ unlocked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.unlocked ? '#e8f5e9' : '#f5f5f5'};
  border: 1px solid ${props => props.unlocked ? '#2e7d32' : '#ddd'};
  border-radius: 16px;
  margin: 4px;
  font-size: 12px;
  color: ${props => props.unlocked ? '#2e7d32' : '#666'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.unlocked ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.unlocked ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const AchievementIcon = styled.span`
  font-size: 16px;
`;

const AchievementSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const AchievementTitle = styled.h4`
  margin: 0 0 8px;
  color: #333;
  font-size: 14px;
`;

const AchievementDescription = styled.p`
  font-size: 12px;
  color: #666;
  margin: 4px 0;
`;

const NodeRequirement = styled.div<{ met: boolean }>`
  padding: 8px;
  background: ${props => props.met ? '#e8f5e9' : '#ffebee'};
  border-radius: 4px;
  font-size: 12px;
  color: ${props => props.met ? '#2e7d32' : '#c62828'};
  margin: 4px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NodeCount = styled.span`
  font-weight: 600;
  margin-left: 8px;
`;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: {
    minEfficiency: number;  // Performance/Cost ratio
    maxLatency: number;     // Maximum allowed latency
    minReliability: number; // Minimum reliability percentage
    pattern: string[];      // Required node types in the pattern
  };
  bonusPoints: number;
}

export interface NodeRequirement {
  type: NodeType;
  minCount: number;
  description: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  minThroughput: number;
  maxCost: number;
  rewards: string[];
  achievements: Achievement[];
  nodeRequirements: NodeRequirement[];
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Level 1: Basic Setup",
    description: "Create a simple architecture that can handle basic traffic",
    minThroughput: 1000,
    maxCost: 5000,
    rewards: ["Basic Architecture Badge", "100 Points"],
    achievements: [
      {
        id: "l1-efficient",
        name: "Efficient Starter",
        description: "Create a simple but efficient architecture with a single load balancer and two application servers",
        icon: "⚡",
        requirements: {
          minEfficiency: 0.5,
          maxLatency: 100,
          minReliability: 99,
          pattern: ["lb", "app", "app"]
        },
        bonusPoints: 50
      }
    ],
    nodeRequirements: [
      {
        type: "lb",
        minCount: 1,
        description: "Load Balancer"
      },
      {
        type: "app",
        minCount: 2,
        description: "Application Servers"
      },
      {
        type: "db",
        minCount: 1,
        description: "Database"
      }
    ]
  },
  {
    id: 2,
    name: "Level 2: Growing Pains",
    description: "Scale your architecture to handle more traffic while keeping costs down",
    minThroughput: 5000,
    maxCost: 4000,
    rewards: ["Scalability Badge", "200 Points"],
    achievements: [
      {
        id: "l2-scalable",
        name: "Scalable Master",
        description: "Implement a scalable architecture with auto-scaling groups and caching",
        icon: "📈",
        requirements: {
          minEfficiency: 1.5,
          maxLatency: 50,
          minReliability: 99.5,
          pattern: ["lb", "asg", "cache", "db"]
        },
        bonusPoints: 100
      }
    ],
    nodeRequirements: [
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers (for redundancy)"
      },
      {
        type: "app",
        minCount: 3,
        description: "Application Servers"
      },
      {
        type: "cache",
        minCount: 1,
        description: "Cache Layer"
      },
      {
        type: "db",
        minCount: 2,
        description: "Databases (primary + replica)"
      }
    ]
  },
  {
    id: 3,
    name: "Level 3: High Availability",
    description: "Design a highly available system that can handle failures gracefully",
    minThroughput: 10000,
    maxCost: 8000,
    rewards: ["High Availability Badge", "300 Points"],
    achievements: [
      {
        id: "l3-ha",
        name: "Fault Tolerant",
        description: "Implement a fault-tolerant architecture with multiple availability zones",
        icon: "🛡️",
        requirements: {
          minEfficiency: 2.0,
          maxLatency: 30,
          minReliability: 99.9,
          pattern: ["lb", "lb", "app", "app", "app", "cache", "cache", "db", "db"]
        },
        bonusPoints: 150
      }
    ],
    nodeRequirements: [
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers (active-active)"
      },
      {
        type: "app",
        minCount: 4,
        description: "Application Servers"
      },
      {
        type: "cache",
        minCount: 2,
        description: "Cache Servers (replicated)"
      },
      {
        type: "db",
        minCount: 2,
        description: "Databases (master-slave)"
      }
    ]
  },
  {
    id: 4,
    name: "Level 4: Microservices",
    description: "Break down your application into microservices for better scalability",
    minThroughput: 15000,
    maxCost: 12000,
    rewards: ["Microservices Badge", "400 Points"],
    achievements: [
      {
        id: "l4-micro",
        name: "Microservices Expert",
        description: "Implement a microservices architecture with service discovery",
        icon: "🔍",
        requirements: {
          minEfficiency: 2.5,
          maxLatency: 25,
          minReliability: 99.95,
          pattern: ["lb", "gateway", "micro", "micro", "micro", "mq", "cache", "db"]
        },
        bonusPoints: 200
      }
    ],
    nodeRequirements: [
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers"
      },
      {
        type: "gateway",
        minCount: 1,
        description: "API Gateway"
      },
      {
        type: "micro",
        minCount: 3,
        description: "Microservices"
      },
      {
        type: "mq",
        minCount: 1,
        description: "Message Queue"
      },
      {
        type: "cache",
        minCount: 2,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 2,
        description: "Databases"
      }
    ]
  },
  {
    id: 5,
    name: "Level 5: Global Distribution",
    description: "Distribute your application globally for better user experience",
    minThroughput: 20000,
    maxCost: 15000,
    rewards: ["Global Distribution Badge", "500 Points"],
    achievements: [
      {
        id: "l5-global",
        name: "Global Architect",
        description: "Implement a globally distributed architecture with CDN",
        icon: "🌍",
        requirements: {
          minEfficiency: 3.0,
          maxLatency: 20,
          minReliability: 99.99,
          pattern: ["cdn", "cdn", "lb", "lb", "app", "app", "app", "cache", "cache", "db", "db"]
        },
        bonusPoints: 250
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 2,
        description: "CDN Edge Servers"
      },
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers"
      },
      {
        type: "app",
        minCount: 4,
        description: "Application Servers"
      },
      {
        type: "cache",
        minCount: 2,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 2,
        description: "Databases"
      }
    ]
  },
  {
    id: 6,
    name: "Level 6: Real-time Processing",
    description: "Add real-time processing capabilities to your architecture",
    minThroughput: 25000,
    maxCost: 18000,
    rewards: ["Real-time Processing Badge", "600 Points"],
    achievements: [
      {
        id: "l6-realtime",
        name: "Real-time Expert",
        description: "Implement a real-time processing pipeline with message queues",
        icon: "⚡",
        requirements: {
          minEfficiency: 3.5,
          maxLatency: 15,
          minReliability: 99.995,
          pattern: ["cdn", "lb", "gateway", "app", "app", "mq", "mq", "cache", "cache", "db", "db"]
        },
        bonusPoints: 300
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 2,
        description: "CDN Edge Servers"
      },
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers"
      },
      {
        type: "gateway",
        minCount: 1,
        description: "API Gateway"
      },
      {
        type: "app",
        minCount: 4,
        description: "Application Servers"
      },
      {
        type: "mq",
        minCount: 2,
        description: "Message Queues"
      },
      {
        type: "cache",
        minCount: 2,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 2,
        description: "Databases"
      }
    ]
  },
  {
    id: 7,
    name: "Level 7: Data Processing",
    description: "Add data processing capabilities to handle large datasets",
    minThroughput: 30000,
    maxCost: 20000,
    rewards: ["Data Processing Badge", "700 Points"],
    achievements: [
      {
        id: "l7-data",
        name: "Data Processing Expert",
        description: "Implement a data processing pipeline with multiple databases",
        icon: "📊",
        requirements: {
          minEfficiency: 4.0,
          maxLatency: 10,
          minReliability: 99.999,
          pattern: ["cdn", "lb", "gateway", "app", "app", "app", "mq", "mq", "cache", "cache", "db", "db", "db"]
        },
        bonusPoints: 350
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 2,
        description: "CDN Edge Servers"
      },
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers"
      },
      {
        type: "gateway",
        minCount: 1,
        description: "API Gateway"
      },
      {
        type: "app",
        minCount: 5,
        description: "Application Servers"
      },
      {
        type: "mq",
        minCount: 2,
        description: "Message Queues"
      },
      {
        type: "cache",
        minCount: 2,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 3,
        description: "Databases"
      }
    ]
  },
  {
    id: 8,
    name: "Level 8: Disaster Recovery",
    description: "Implement a comprehensive disaster recovery strategy",
    minThroughput: 35000,
    maxCost: 25000,
    rewards: ["Disaster Recovery Badge", "800 Points"],
    achievements: [
      {
        id: "l8-dr",
        name: "Disaster Recovery Expert",
        description: "Implement a multi-region disaster recovery setup",
        icon: "🔄",
        requirements: {
          minEfficiency: 4.5,
          maxLatency: 8,
          minReliability: 99.9999,
          pattern: ["cdn", "cdn", "lb", "lb", "gateway", "app", "app", "app", "mq", "mq", "cache", "cache", "db", "db", "dr"]
        },
        bonusPoints: 400
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 3,
        description: "CDN Edge Servers"
      },
      {
        type: "lb",
        minCount: 3,
        description: "Load Balancers"
      },
      {
        type: "gateway",
        minCount: 2,
        description: "API Gateways"
      },
      {
        type: "app",
        minCount: 6,
        description: "Application Servers"
      },
      {
        type: "mq",
        minCount: 2,
        description: "Message Queues"
      },
      {
        type: "cache",
        minCount: 3,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 3,
        description: "Databases"
      },
      {
        type: "dr",
        minCount: 1,
        description: "Disaster Recovery Server"
      }
    ]
  },
  {
    id: 9,
    name: "Level 9: Auto Scaling",
    description: "Implement dynamic auto-scaling for optimal resource utilization",
    minThroughput: 40000,
    maxCost: 30000,
    rewards: ["Auto Scaling Badge", "900 Points"],
    achievements: [
      {
        id: "l9-autoscale",
        name: "Auto Scaling Expert",
        description: "Implement a fully automated scaling system",
        icon: "📈",
        requirements: {
          minEfficiency: 5.0,
          maxLatency: 5,
          minReliability: 99.9999,
          pattern: ["cdn", "cdn", "lb", "lb", "gateway", "asg", "asg", "mq", "mq", "cache", "cache", "db", "db", "dr"]
        },
        bonusPoints: 450
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 3,
        description: "CDN Edge Servers"
      },
      {
        type: "lb",
        minCount: 3,
        description: "Load Balancers"
      },
      {
        type: "gateway",
        minCount: 2,
        description: "API Gateways"
      },
      {
        type: "asg",
        minCount: 2,
        description: "Auto Scaling Groups"
      },
      {
        type: "mq",
        minCount: 2,
        description: "Message Queues"
      },
      {
        type: "cache",
        minCount: 3,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 3,
        description: "Databases"
      },
      {
        type: "dr",
        minCount: 1,
        description: "Disaster Recovery Server"
      }
    ]
  },
  {
    id: 10,
    name: "Level 10: Enterprise Scale",
    description: "Design an enterprise-grade architecture that can handle massive scale",
    minThroughput: 50000,
    maxCost: 40000,
    rewards: ["Enterprise Architect Badge", "1000 Points"],
    achievements: [
      {
        id: "l10-enterprise",
        name: "Enterprise Architect",
        description: "Implement a complete enterprise-grade architecture",
        icon: "🏢",
        requirements: {
          minEfficiency: 6.0,
          maxLatency: 3,
          minReliability: 99.99999,
          pattern: ["cdn", "cdn", "cdn", "lb", "lb", "lb", "gateway", "gateway", "asg", "asg", "mq", "mq", "mq", "cache", "cache", "cache", "db", "db", "db", "dr"]
        },
        bonusPoints: 500
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 4,
        description: "CDN Edge Servers"
      },
      {
        type: "lb",
        minCount: 4,
        description: "Load Balancers"
      },
      {
        type: "gateway",
        minCount: 3,
        description: "API Gateways"
      },
      {
        type: "asg",
        minCount: 3,
        description: "Auto Scaling Groups"
      },
      {
        type: "mq",
        minCount: 3,
        description: "Message Queues"
      },
      {
        type: "cache",
        minCount: 4,
        description: "Cache Servers"
      },
      {
        type: "db",
        minCount: 4,
        description: "Databases"
      },
      {
        type: "dr",
        minCount: 2,
        description: "Disaster Recovery Servers"
      }
    ]
  }
];

interface LevelManagerProps {
  currentLevel: number;
  currentThroughput: number;
  currentCost: number;
  currentLatency: number;
  currentReliability: number;
  nodePattern: string[];
  onLevelComplete: () => void;
}

export default function LevelManager({ 
  currentLevel, 
  currentThroughput, 
  currentCost,
  currentLatency,
  currentReliability,
  nodePattern,
  onLevelComplete 
}: LevelManagerProps) {
  const level = levels[currentLevel - 1];
  const throughputProgress = Math.min((currentThroughput / level.minThroughput) * 100, 100);
  const costProgress = Math.min((currentCost / level.maxCost) * 100, 100);
  const efficiency = currentThroughput / currentCost;
  
  const checkAchievement = (achievement: Achievement) => {
    return (
      efficiency >= achievement.requirements.minEfficiency &&
      currentLatency <= achievement.requirements.maxLatency &&
      currentReliability >= achievement.requirements.minReliability &&
      achievement.requirements.pattern.every(pattern => 
        nodePattern.includes(pattern)
      )
    );
  };

  const checkNodeRequirement = (requirement: NodeRequirement) => {
    const count = nodePattern.filter(type => type === requirement.type).length;
    return count >= requirement.minCount;
  };

  const unlockedAchievements = level.achievements.filter(checkAchievement);
  const isLevelComplete = currentThroughput >= level.minThroughput && 
                         currentCost <= level.maxCost &&
                         level.nodeRequirements.every(checkNodeRequirement);

  return (
    <LevelContainer>
      <LevelTitle>{level.name}</LevelTitle>
      <LevelDescription>{level.description}</LevelDescription>
      
      <div>
        <strong>Throughput Required:</strong> {level.minThroughput} ops/sec
        <ProgressBar>
          <Progress progress={throughputProgress} />
        </ProgressBar>
        <Requirement met={currentThroughput >= level.minThroughput}>
          Current: {currentThroughput} ops/sec
        </Requirement>
      </div>

      <div>
        <strong>Maximum Cost:</strong> ${level.maxCost}/month
        <ProgressBar>
          <Progress progress={costProgress} />
        </ProgressBar>
        <Requirement met={currentCost <= level.maxCost}>
          Current: ${currentCost}/month
        </Requirement>
      </div>

      <div>
        <strong>Node Requirements:</strong>
        {level.nodeRequirements.map((req, index) => {
          const met = checkNodeRequirement(req);
          return (
            <NodeRequirement key={index} met={met}>
              <span>{req.description}</span>
              <NodeCount>
                {nodePattern.filter(type => type === req.type).length}/{req.minCount}
              </NodeCount>
            </NodeRequirement>
          );
        })}
      </div>

      <AchievementSection>
        <AchievementTitle>Special Achievements</AchievementTitle>
        {level.achievements.map(achievement => {
          const unlocked = checkAchievement(achievement);
          return (
            <AchievementBadge key={achievement.id} unlocked={unlocked}>
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <div>
                <strong>{achievement.name}</strong>
                <AchievementDescription>{achievement.description}</AchievementDescription>
                {unlocked && <div>+{achievement.bonusPoints} bonus points!</div>}
              </div>
            </AchievementBadge>
          );
        })}
      </AchievementSection>

      <Requirements>
        <div>
          <strong>Rewards:</strong>
          <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
            {level.rewards.map((reward, index) => (
              <li key={index} style={{ fontSize: '12px', color: '#666' }}>{reward}</li>
            ))}
          </ul>
        </div>
      </Requirements>

      <NextLevelButton 
        onClick={onLevelComplete}
        disabled={!isLevelComplete}
      >
        {isLevelComplete ? 'Complete Level' : 'Requirements Not Met'}
      </NextLevelButton>
    </LevelContainer>
  );
} 