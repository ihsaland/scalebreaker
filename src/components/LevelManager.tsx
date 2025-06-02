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
    name: "Level 3: Cost Optimization",
    description: "Optimize your architecture for better performance at lower costs",
    minThroughput: 10000,
    maxCost: 3000,
    rewards: ["Cost Optimization Badge", "300 Points"],
    achievements: [
      {
        id: "l3-optimized",
        name: "Cost Optimizer",
        description: "Create a highly optimized architecture with CDN and efficient caching",
        icon: "💰",
        requirements: {
          minEfficiency: 4,
          maxLatency: 30,
          minReliability: 99.9,
          pattern: ["cdn", "lb", "cache", "app", "db"]
        },
        bonusPoints: 150
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 1,
        description: "Content Delivery Network"
      },
      {
        type: "lb",
        minCount: 2,
        description: "Load Balancers"
      },
      {
        type: "cache",
        minCount: 2,
        description: "Cache Layers (distributed)"
      },
      {
        type: "app",
        minCount: 4,
        description: "Application Servers"
      },
      {
        type: "db",
        minCount: 2,
        description: "Databases"
      }
    ]
  },
  {
    id: 4,
    name: "Level 4: High Performance",
    description: "Build a high-performance architecture with strict cost constraints",
    minThroughput: 20000,
    maxCost: 2500,
    rewards: ["Performance Badge", "400 Points"],
    achievements: [
      {
        id: "l4-performance",
        name: "Performance Guru",
        description: "Implement a high-performance architecture with microservices and message queues",
        icon: "🚀",
        requirements: {
          minEfficiency: 8,
          maxLatency: 20,
          minReliability: 99.99,
          pattern: ["cdn", "lb", "mq", "micro", "cache", "db"]
        },
        bonusPoints: 200
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 2,
        description: "CDN (global distribution)"
      },
      {
        type: "lb",
        minCount: 3,
        description: "Load Balancers (multi-region)"
      },
      {
        type: "mq",
        minCount: 1,
        description: "Message Queue"
      },
      {
        type: "micro",
        minCount: 3,
        description: "Microservices"
      },
      {
        type: "cache",
        minCount: 3,
        description: "Cache Layers"
      },
      {
        type: "db",
        minCount: 3,
        description: "Databases (sharded)"
      }
    ]
  },
  {
    id: 5,
    name: "Level 5: Enterprise Grade",
    description: "Create an enterprise-grade architecture with maximum efficiency",
    minThroughput: 50000,
    maxCost: 2000,
    rewards: ["Enterprise Badge", "500 Points"],
    achievements: [
      {
        id: "l5-enterprise",
        name: "Enterprise Architect",
        description: "Build an enterprise-grade architecture with full redundancy and disaster recovery",
        icon: "🏢",
        requirements: {
          minEfficiency: 25,
          maxLatency: 10,
          minReliability: 99.999,
          pattern: ["cdn", "lb", "mq", "micro", "cache", "db", "dr"]
        },
        bonusPoints: 500
      }
    ],
    nodeRequirements: [
      {
        type: "cdn",
        minCount: 3,
        description: "CDN (global + regional)"
      },
      {
        type: "lb",
        minCount: 4,
        description: "Load Balancers (multi-region + failover)"
      },
      {
        type: "mq",
        minCount: 2,
        description: "Message Queues (redundant)"
      },
      {
        type: "micro",
        minCount: 5,
        description: "Microservices (distributed)"
      },
      {
        type: "cache",
        minCount: 4,
        description: "Cache Layers (distributed)"
      },
      {
        type: "db",
        minCount: 4,
        description: "Databases (sharded + replicated)"
      },
      {
        type: "dr",
        minCount: 1,
        description: "Disaster Recovery"
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