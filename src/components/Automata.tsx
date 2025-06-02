import { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import styled from '@emotion/styled';
import ServerNode from './ServerNode';
import { simulateArchitecture } from '../services/simulation';
import type { ServerResources, ArchitectureState, NodeType } from '../types/architecture';
import { architectureTemplates } from '../data/architectureTemplates';
import TemplateComparison from './TemplateComparison';
import ServerConfig from './ServerConfig';
import LevelManager, { levels } from './LevelManager';

const nodeTypes = {
  server: ServerNode,
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 4px;
    height: auto;
  }
`;

const MainContent = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  padding: 16px;
  gap: 24px;
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 4px;
    gap: 8px;
    height: auto;
  }
`;

const FlowContainer = styled.div`
  position: relative;
  height: calc(100vh - 100px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 1200px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid rgba(0,0,0,0.05);

  @media (max-width: 900px) {
    width: 100vw;
    min-width: 0;
    padding: 4px;
  }
  @media (max-width: 600px) {
    width: 100vw;
    min-width: 0;
    padding: 2px;
    height: 60vh;
  }
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-650px);
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  z-index: 5;
  width: 300px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a90e2 #f0f0f0;
  border: 1px solid rgba(0,0,0,0.05);

  @media (max-width: 900px) {
    left: 0;
    transform: none;
    width: 90vw;
    max-width: 95vw;
    top: 8px;
    padding: 12px;
    position: static;
  }
  @media (max-width: 600px) {
    width: 98vw;
    max-width: 100vw;
    padding: 4px;
    font-size: 13px;
    position: static;
  }
`;

const PanelSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const PanelTitle = styled.h3`
  margin: 0 0 16px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 8px;
  border-bottom: 2px solid #4a90e2;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);

  &:hover {
    background: #357abd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }

  &:disabled {
    background: #f0f0f0;
    color: #999;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f8f9fa;

  &:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    background: white;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: #4a90e2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    background: white;
  }
`;

const TemplateDescription = styled.div`
  font-size: 12px;
  color: #666;
  margin: 8px 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a90e2 #f0f0f0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a90e2;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #357abd;
  }
`;

const SectionTitle = styled.h4`
  margin: 8px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 8px 0;
`;

const InfoItem = styled.div`
  background: white;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #eee;
`;

interface BestPracticeItemProps {
  impact: 'high' | 'medium' | 'low';
}

const BestPracticeItem = styled.div<BestPracticeItemProps>`
  margin: 4px 0;
  padding: 4px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid ${props => props.impact === 'high' ? '#e74c3c' : props.impact === 'medium' ? '#f1c40f' : '#2ecc71'};
`;

const IndustrySection = styled.div`
  margin: 8px 0;
  padding: 8px;
  background: white;
  border-radius: 4px;
`;

const ComplianceTag = styled.span`
  background: #3498db;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-left: 4px;
`;

const MetricsPanel = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(330px);
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  z-index: 5;
  width: 280px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a90e2 #f0f0f0;
  border: 1px solid rgba(0,0,0,0.05);

  @media (max-width: 900px) {
    left: auto;
    right: 0;
    transform: none;
    width: 90vw;
    max-width: 95vw;
    top: 8px;
    padding: 12px;
    position: static;
  }
  @media (max-width: 600px) {
    width: 98vw;
    max-width: 100vw;
    padding: 4px;
    font-size: 13px;
    position: static;
  }
`;

const TemplateGroup = styled.div`
  margin-bottom: 16px;
`;

const TemplateGroupTitle = styled.h4`
  margin: 8px 0;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TemplateOption = styled.option`
  padding: 4px;
`;

const CategoryLabel = styled.span`
  color: #666;
  font-size: 12px;
  margin-left: 8px;
`;

const ViewToggle = styled.div`
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 6px;
  background: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  min-width: 400px;
  justify-content: center;
  border: 1px solid rgba(0,0,0,0.05);
  height: 40px;
  align-items: center;

  @media (max-width: 600px) {
    min-width: 0;
    width: 98vw;
    flex-wrap: wrap;
    padding: 4px 2px;
    height: auto;
    top: 2px;
  }
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  background: ${props => props.active ? '#4a90e2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid ${props => props.active ? '#4a90e2' : '#ddd'};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 12px;
  box-shadow: ${props => props.active ? '0 2px 8px rgba(74, 144, 226, 0.2)' : 'none'};
  height: 28px;
  display: flex;
  align-items: center;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? '#357abd' : '#f5f5f5'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const NodeHighlight = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  pointer-events: none;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`;

const FailurePoint = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #f1c40f;
  border-radius: 8px;
  pointer-events: none;
  animation: warning 2s infinite;
  @keyframes warning {
    0% { opacity: 0.3; }
    50% { opacity: 0.7; }
    100% { opacity: 0.3; }
  }
`;

const Legend = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  z-index: 5;
  min-width: 180px;
  max-width: 240px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #666;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${props => props.color};
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
`;

const ConfigPanel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 100%;
  max-width: 400px;
  padding: 0 16px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
`;

const CostSummary = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 5;
  min-width: 250px;
`;

const CostHeader = styled.h4`
  margin: 0 0 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const CostBreakdown = styled.div`
  font-size: 12px;
  color: #666;
`;

const CostRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
`;

const TotalCostRow = styled(CostRow)`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
  font-weight: 600;
  color: #333;
`;

// Resource costs per unit (monthly)
const resourceCosts = {
  cpu: 50, // $ per GHz
  cpuCores: 20, // $ per core
  memory: 5, // $ per GB
  networkBandwidth: 0.1, // $ per Mbps
};

const defaultResources: ServerResources = {
  cpu: 2.4,
  cpuCores: 4,
  memory: 16,
  networkBandwidth: 1000,
};

const ValidationStatusDisplay = styled.div<{ isMinimized: boolean }>`
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 1000;
  background: white;
  padding: ${props => props.isMinimized ? '8px 16px' : '16px'};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  min-width: ${props => props.isMinimized ? '200px' : '300px'};
  max-width: 400px;
  border: 1px solid rgba(0,0,0,0.05);
  max-height: ${props => props.isMinimized ? 'auto' : 'calc(100vh - 200px)'};
  overflow-y: ${props => props.isMinimized ? 'hidden' : 'auto'};
  margin-right: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  transform: none;
`;

const ValidationStatusTitle = styled.div<{ isValid: boolean }>`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.isValid ? '#2ecc71' : '#e74c3c'};
  gap: 12px;
`;

const ValidationToggleButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #ddd;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 4px;
  min-width: 28px;
  height: 28px;
  
  &:hover {
    background: #e9ecef;
    color: #333;
    transform: scale(1.05);
  }
`;

const ValidationStatusList = styled.div`
  font-size: 12px;
  color: #666;
`;

const ValidationStatusItem = styled.div<{ type: 'error' | 'warning' }>`
  margin: 4px 0;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${props => props.type === 'error' ? '#fde8e8' : '#fff8e1'};
  color: ${props => props.type === 'error' ? '#e74c3c' : '#f1c40f'};
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: ${props => props.type === 'error' ? '"✗"' : '"⚠"'};
  }
`;

const StartingPoint = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  pointer-events: none;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`;

const LevelCompleteModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  z-index: 1000;
  text-align: center;
  min-width: 300px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const Confetti = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
`;

const EndPoint = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #2ecc71;
  border-radius: 8px;
  pointer-events: none;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`;

const MetricItem = styled.div`
  margin: 8px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transform: translateY(-1px);
  }
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

// Add validation helper function
const isValidNodeType = (type: string): type is NodeType => {
  const validTypes: NodeType[] = ['lb', 'app', 'db', 'cache', 'cdn', 'mq', 'micro', 'dr'];
  return validTypes.includes(type as NodeType);
};

// Update calculateNodePattern with proper typing
const calculateNodePattern = (nodes: Node[]): string[] => {
  return nodes.map(node => {
    // Skip user node
    if (node.id === 'user') return '';
    
    // Use the node's data.type property for accurate type identification
    const type = node.data.type;
    
    // Validate node type
    if (!isValidNodeType(type)) {
      console.warn(`Invalid node type "${type}" for node ${node.id}. Expected one of: lb, app, db, cache, cdn, mq, micro, dr, gateway, asg`);
      return '';
    }
    
    // Map the type to the required pattern format
    switch (type) {
      case 'lb':
      case 'gateway':
        return 'lb';
      case 'cdn':
        return 'cdn';
      case 'cache':
        return 'cache';
      case 'mq':
        return 'mq';
      case 'micro':
        return 'micro';
      case 'app':
        return 'app';
      case 'asg':
        return 'asg';
      case 'db':
        return 'db';
      case 'dr':
        return 'dr';
      default:
        console.warn(`Unhandled node type "${type}" for node ${node.id}`);
        return '';
    }
  }).filter(Boolean); // Remove empty strings
};

const LevelManagerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  width: 100%;
  max-width: 600px;
  padding: 0 16px;
`;

// Add interface at the top with other interfaces
interface SavedState {
  currentLevel: number;
  totalPoints: number;
  nodes: Node[];
  edges: Edge[];
  nodeId: number;
  entryPoint: Node | null;
  userNode: Node;
  selectedTemplate: string;
  targetThroughput: number;
  simulationResults: ArchitectureState['metrics'] | null;
  view: 'design' | 'compare';
  selectedTemplates: string[];
  highlightedNodes: string[];
  failurePoints: string[];
  currentLatency: number;
  currentReliability: number;
  showLevelManager: boolean;
  showControlPanel: boolean;
  showMetricsPanel: boolean;
}

interface ServerConfigProps {
  node: Node;
  onUpdate: (updatedNode: Node) => void;
  onClose: () => void;
  onDelete: () => void;
}

// Update server type definitions with more specialized configurations
const serverTypes = [
  { 
    name: 'Load Balancer', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 16, networkBandwidth: 5000 },
    description: 'High network throughput for traffic distribution',
    type: 'lb'
  },
  { 
    name: 'API Gateway', 
    resources: { cpu: 2.8, cpuCores: 6, memory: 24, networkBandwidth: 4000 },
    description: 'Optimized for request routing and API management',
    type: 'gateway'
  },
  { 
    name: 'Application Server', 
    resources: { cpu: 3.2, cpuCores: 8, memory: 32, networkBandwidth: 2000 },
    description: 'Balanced configuration for application workloads',
    type: 'app'
  },
  { 
    name: 'Microservice', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 16, networkBandwidth: 2000 },
    description: 'Lightweight configuration for microservices',
    type: 'micro'
  },
  { 
    name: 'Cache Server', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 32, networkBandwidth: 3000 },
    description: 'High memory for caching operations',
    type: 'cache'
  },
  { 
    name: 'Message Queue', 
    resources: { cpu: 2.8, cpuCores: 6, memory: 24, networkBandwidth: 3000 },
    description: 'Optimized for message processing and queuing',
    type: 'mq'
  },
  { 
    name: 'Database Server', 
    resources: { cpu: 4.0, cpuCores: 8, memory: 64, networkBandwidth: 2000 },
    description: 'High performance for database operations',
    type: 'db'
  },
  { 
    name: 'CDN Edge', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 16, networkBandwidth: 5000 },
    description: 'High bandwidth for content delivery',
    type: 'cdn'
  },
  { 
    name: 'Auto Scaling Group', 
    resources: { cpu: 2.8, cpuCores: 6, memory: 24, networkBandwidth: 2000 },
    description: 'Scalable configuration for dynamic workloads',
    type: 'asg'
  },
  { 
    name: 'Backup Server', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 32, networkBandwidth: 2000 },
    description: 'Optimized for data backup and recovery',
    type: 'dr'
  }
];

// Add validation types
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const EdgePopup = styled.div`
  position: fixed;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  z-index: 1000;
  min-width: 200px;
  border: 1px solid rgba(0,0,0,0.05);
  pointer-events: auto;
  transform-origin: center bottom;
  animation: popupFadeIn 0.2s ease-out;
  @keyframes popupFadeIn {
    from { opacity: 0; transform: translate(-50%, -90%); }
    to { opacity: 1; transform: translate(-50%, -100%); }
  }
`;

const EdgeButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const EdgeButton = styled.button<{ variant?: 'delete' | 'cancel' }>`
  padding: 8px 16px;
  background: ${props => props.variant === 'delete' ? '#e74c3c' : '#95a5a6'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'delete' ? '#c0392b' : '#7f8c8d'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EdgePopupTitle = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  text-align: center;
`;

export default function Automata() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(0);
  const [targetThroughput, setTargetThroughput] = useState(1000);
  const [simulationResults, setSimulationResults] = useState<ArchitectureState['metrics'] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedServerType, setSelectedServerType] = useState('');
  const [view, setView] = useState<'design' | 'compare'>('design');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [failurePoints, setFailurePoints] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentLatency, setCurrentLatency] = useState(0);
  const [currentReliability, setCurrentReliability] = useState(100);
  const [showLevelManager, setShowLevelManager] = useState(true);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [showMetricsPanel, setShowMetricsPanel] = useState(true);
  const [showTemplateLimitWarning, setShowTemplateLimitWarning] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgePopupPosition, setEdgePopupPosition] = useState({ x: 0, y: 0 });
  const [isValidationMinimized, setIsValidationMinimized] = useState(true);

  // Add new state for user node
  const [userNode, setUserNode] = useState<Node>({
    id: 'user',
    type: 'server',
    position: { x: 50, y: 50 },
    data: {
      id: 'user',
      type: 'user',
      resources: { ...defaultResources },
      currentLoad: 0,
      maxThroughput: 0,
      isHealthy: true,
      isUser: true
    },
  });

  // Add new state for entry point
  const [entryPoint, setEntryPoint] = useState<Node | null>(null);

  // Add new state for tracking if game has been initialized
  const [isInitialized, setIsInitialized] = useState(false);

  // Add save and load functions at the top
  const saveGameState = useCallback(() => {
    const state: SavedState = {
      currentLevel,
      totalPoints,
      nodes,
      edges,
      nodeId,
      entryPoint,
      userNode,
      selectedTemplate,
      targetThroughput,
      simulationResults,
      view,
      selectedTemplates,
      highlightedNodes,
      failurePoints,
      currentLatency,
      currentReliability,
      showLevelManager,
      showControlPanel,
      showMetricsPanel
    };
    localStorage.setItem('automataGameState', JSON.stringify(state));
  }, [
    currentLevel,
    totalPoints,
    nodes,
    edges,
    nodeId,
    entryPoint,
    userNode,
    selectedTemplate,
    targetThroughput,
    simulationResults,
    view,
    selectedTemplates,
    highlightedNodes,
    failurePoints,
    currentLatency,
    currentReliability,
    showLevelManager,
    showControlPanel,
    showMetricsPanel
  ]);

  const loadGameState = useCallback(() => {
    const savedState = localStorage.getItem('automataGameState');
    if (savedState) {
      const state: SavedState = JSON.parse(savedState);
      setCurrentLevel(state.currentLevel);
      setTotalPoints(state.totalPoints);
      setNodes(state.nodes);
      setEdges(state.edges);
      setNodeId(state.nodeId);
      setEntryPoint(state.entryPoint);
      setUserNode(state.userNode);
      setSelectedTemplate(state.selectedTemplate || '');
      setTargetThroughput(state.targetThroughput || 1000);
      setSimulationResults(state.simulationResults || null);
      setView(state.view || 'design');
      setSelectedTemplates(state.selectedTemplates || []);
      setHighlightedNodes(state.highlightedNodes || []);
      setFailurePoints(state.failurePoints || []);
      setCurrentLatency(state.currentLatency || 0);
      setCurrentReliability(state.currentReliability || 100);
      setShowLevelManager(state.showLevelManager !== undefined ? state.showLevelManager : true);
      setShowControlPanel(state.showControlPanel !== undefined ? state.showControlPanel : true);
      setShowMetricsPanel(state.showMetricsPanel !== undefined ? state.showMetricsPanel : true);
      setIsInitialized(true);
    }
  }, []);

  // Add reset game function after loadGameState
  const resetGame = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the game? This will clear all progress.')) {
      localStorage.removeItem('automataGameState');
      setCurrentLevel(1);
      setTotalPoints(0);
      setNodes([]);
      setEdges([]);
      setNodeId(0);
      setSimulationResults(null);
      setFailurePoints([]);
      setSelectedNode(null);
      setShowConfig(false);
      setValidationErrors([]);
      setShowValidation(false);
      setCurrentLatency(0);
      setCurrentReliability(100);
      setEntryPoint(null);
      setSelectedTemplate('');
      setTargetThroughput(1000);
      setView('design');
      setSelectedTemplates([]);
      setHighlightedNodes([]);
      setUserNode({
        id: 'user',
        type: 'server',
        position: { x: 50, y: 50 },
        data: {
          id: 'user',
          type: 'user',
          resources: { ...defaultResources },
          currentLoad: 0,
          maxThroughput: 0,
          isHealthy: true,
          isUser: true
        },
      });
      setShowLevelManager(true);
      setShowControlPanel(true);
      setShowMetricsPanel(true);
      setIsInitialized(true);
    }
  }, []);

  // Add useEffect to save state when it changes
  useEffect(() => {
    if (isInitialized) {
      saveGameState();
    }
  }, [saveGameState, isInitialized]);

  // Add useEffect to load state on initial mount
  useEffect(() => {
    if (!isInitialized) {
      loadGameState();
    }
  }, [loadGameState, isInitialized]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge_${edges.length}`,
        bandwidth: 1000,
        currentLoad: 0,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, edges.length]
  );

  // Update the addNewNode function to include server type
  const addNewNode = useCallback((serverType = serverTypes[0]) => {
    // Validate server type
    if (!isValidNodeType(serverType.type)) {
      console.error(`Invalid server type "${serverType.type}". Cannot add node.`);
      return;
    }

    const newNode: Node = {
      id: `node_${nodeId}`,
      type: 'server',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        id: `node_${nodeId}`,
        type: serverType.type,
        resources: { ...serverType.resources },
        currentLoad: 0,
        maxThroughput: 0,
        isHealthy: true,
        serverType: serverType.name,
        description: serverType.description,
        isStartingPoint: false,
        isEndPoint: false
      },
    };
    setNodes((nds) => [...nds, newNode]);
    
    // Add connection from user node to new node
    const newEdge = {
      id: `edge_user_${nodeId}`,
      source: 'user',
      target: `node_${nodeId}`,
      bandwidth: 1000,
      currentLoad: 0,
    };
    setEdges((eds) => [...eds, newEdge]);
    
    setNodeId((prev) => prev + 1);
  }, [nodeId, setNodes, setEdges]);

  // Add method to create entry point
  const createEntryPoint = useCallback(() => {
    const newEntryPoint: Node = {
      id: `entry_${nodeId}`,
      type: 'server',
      position: { x: 150, y: 50 }, // Position it to the right of the user node
      data: {
        id: `entry_${nodeId}`,
        type: 'entry',
        resources: { ...defaultResources },
        currentLoad: 0,
        maxThroughput: 0,
        isHealthy: true,
        isEntryPoint: true
      },
    };
    
    setEntryPoint(newEntryPoint);
    setNodes((nds) => [...nds, newEntryPoint]);
    
    // Connect user node to entry point
    const newEdge = {
      id: `edge_user_entry_${nodeId}`,
      source: 'user',
      target: `entry_${nodeId}`,
      bandwidth: 1000,
      currentLoad: 0,
    };
    setEdges((eds) => [...eds, newEdge]);
    
    setNodeId((prev) => prev + 1);
  }, [nodeId, setNodes, setEdges]);

  // Add database node creation method
  const createDatabase = useCallback(() => {
    const newDatabase: Node = {
      id: `db_${nodeId}`,
      type: 'server',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        id: `db_${nodeId}`,
        type: 'db',  // Changed from 'database' to 'db' to match the pattern
        resources: {
          ...defaultResources,
          // Increase resources for database
          cpu: 4.0,
          cpuCores: 8,
          memory: 32,
          networkBandwidth: 2000
        },
        currentLoad: 0,
        maxThroughput: 0,
        isHealthy: true,
        isDatabase: true,
        serverType: 'Database Server',  // Added serverType for display
        databaseType: 'postgresql', // Default database type
        replicationFactor: 1
      },
    };
    
    setNodes((nds) => [...nds, newDatabase]);
    setNodeId((prev) => prev + 1);
  }, [nodeId, setNodes]);

  const applyTemplate = useCallback((templateName: string) => {
    const template = architectureTemplates.find(t => t.name === templateName);
    if (template) {
      // Validate all node types in template
      const invalidNodes = template.initialState.nodes.filter(node => !isValidNodeType(node.type));
      if (invalidNodes.length > 0) {
        console.error('Template contains invalid node types:', invalidNodes);
        return;
      }

      const newNodes = template.initialState.nodes.map(node => ({
        id: node.id,
        type: 'server',
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: {
          id: node.id,
          type: node.type,
          resources: node.resources,
          currentLoad: node.currentLoad,
          maxThroughput: node.maxThroughput,
          isHealthy: node.isHealthy,
        },
      }));
      setNodes(newNodes);
      setEdges(template.initialState.connections);
      setTargetThroughput(template.recommendedThroughput);
      setSelectedTemplate(templateName);

      // Set starting point (usually the entry point of the architecture)
      const entryPoint = newNodes.find(node => 
        node.id.includes('gateway') || 
        node.id.includes('lb') || 
        node.id.includes('ingest')
      );
      if (entryPoint) {
        setHighlightedNodes([entryPoint.id]);
      }

      // Identify potential failure points (usually high-load or critical nodes)
      const potentialFailures = newNodes
        .filter(node => 
          node.id.includes('db') || 
          node.id.includes('storage') || 
          node.id.includes('processor')
        )
        .map(node => node.id);
      setFailurePoints(potentialFailures);
    }
  }, [setNodes, setEdges]);

  // Modify the runSimulation function to use entry point
  const runSimulation = useCallback(() => {
    if (!entryPoint) {
      alert('Please create an entry point before running the simulation');
      return;
    }

    const state: ArchitectureState = {
      nodes: nodes.map(node => ({
        ...node.data,
        isStartingPoint: node.id === entryPoint.id
      })),
      connections: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        bandwidth: 1000,
        currentLoad: 0,
      })),
      metrics: {
        totalThroughput: 0,
        systemHealth: 100,
        bottleneckNodes: [],
        maxAchievableThroughput: 0,
        latency: 0,
        reliability: 100
      },
    };

    const results = simulateArchitecture(state, targetThroughput);
    console.log('Simulation results:', results);
    setSimulationResults(results.metrics);
    
    setCurrentLatency(results.metrics.latency);
    setCurrentReliability(results.metrics.reliability);
    
    if (results.metrics.bottleneckNodes.length > 0) {
      setFailurePoints(results.metrics.bottleneckNodes);
    }
  }, [nodes, edges, targetThroughput, entryPoint]);

  const selectedTemplateData = useMemo(() => 
    architectureTemplates.find(t => t.name === selectedTemplate),
    [selectedTemplate]
  );

  const groupedTemplates = useMemo(() => {
    const groups = {
      basic: architectureTemplates.filter(t => t.complexity === 'basic'),
      intermediate: architectureTemplates.filter(t => t.complexity === 'intermediate'),
      advanced: architectureTemplates.filter(t => t.complexity === 'advanced'),
    };
    return groups;
  }, []);

  // Add back the necessary functions
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.id !== 'user') {
      setSelectedNode(node);
      setShowConfig(true);
    }
  }, []);

  const calculateTotalCost = useCallback(() => {
    const costs = nodes.reduce((acc, node) => {
      const resources = node.data.resources;
      return {
        cpu: acc.cpu + (resources.cpu * resourceCosts.cpu),
        cpuCores: acc.cpuCores + (resources.cpuCores * resourceCosts.cpuCores),
        memory: acc.memory + (resources.memory * resourceCosts.memory),
        networkBandwidth: acc.networkBandwidth + (resources.networkBandwidth * resourceCosts.networkBandwidth),
      };
    }, { cpu: 0, cpuCores: 0, memory: 0, networkBandwidth: 0 });

    const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    return { costs, total };
  }, [nodes]);

  const handleLevelComplete = useCallback(() => {
    const level = levels[currentLevel - 1];
    setTotalPoints(prev => prev + level.rewards.reduce((sum, reward) => {
      const points = parseInt(reward.match(/\d+/)?.[0] || '0');
      return sum + points;
    }, 0));
    setShowLevelComplete(true);
  }, [currentLevel]);

  const handleNextLevel = useCallback(() => {
    setShowLevelComplete(false);
    setCurrentLevel(prev => Math.min(prev + 1, levels.length));
    
    // Reset all stage-related state
    setNodes([]);
    setEdges([]);
    setNodeId(0);
    setSimulationResults(null);
    setFailurePoints([]);
    setSelectedNode(null);
    setShowConfig(false);
    setValidationErrors([]);
    setShowValidation(false);
    setCurrentLatency(0);
    setCurrentReliability(100);
    setEntryPoint(null);
    
    // Reset user node position
    setUserNode(prev => ({
      ...prev,
      position: { x: 50, y: 50 }
    }));
    
    // Show LevelManager for the new level
    setShowLevelManager(true);
    
    // Save state after reset
    saveGameState();
  }, [saveGameState]);

  const handleSimulation = useCallback(() => {
    runSimulation();
  }, [runSimulation]);

  // Add useEffect to show LevelManager on initial load
  useEffect(() => {
    setShowLevelManager(true);
  }, []);

  // Move validation function inside component
  const validateFiniteAutomata = useCallback((): ValidationResult => {
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

    // Get incoming and outgoing connections for each node
    const incomingConnections = new Map<string, number>();
    const outgoingConnections = new Map<string, number>();
    edges.forEach(edge => {
      incomingConnections.set(edge.target, (incomingConnections.get(edge.target) || 0) + 1);
      outgoingConnections.set(edge.source, (outgoingConnections.get(edge.source) || 0) + 1);
    });

    // Production Architecture Requirements
    const hasLoadBalancer = nodes.some(node => node.data.type === 'lb');
    const hasDatabase = nodes.some(node => node.data.type === 'db');
    const hasCache = nodes.some(node => node.data.type === 'cache');
    const hasMultipleAppServers = nodes.filter(node => 
      node.data.type === 'app' || node.data.type === 'micro'
    ).length > 1;

    // Validate entry point connections
    if (entryPoint) {
      const entryPointIncoming = incomingConnections.get(entryPoint.id) || 0;
      const entryPointOutgoing = outgoingConnections.get(entryPoint.id) || 0;

      // Entry point must have incoming connection from user
      const hasUserConnection = edges.some(edge => 
        edge.source === 'user' && edge.target === entryPoint.id
      );
      if (!hasUserConnection) {
        errors.push('Entry point must have an incoming connection from the user');
        isValid = false;
      }

      // Entry point must have outgoing connections
      if (entryPointOutgoing === 0) {
        errors.push('Entry point must have outgoing connections');
        isValid = false;
      }
    }

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

    // Validate each node based on its type
    nodes.forEach(node => {
      if (!connectedNodes.has(node.id) && node.id !== 'user') {
        const nodeName = node.data.serverType || node.data.type;
        errors.push(`Node "${nodeName}" is isolated`);
        isValid = false;
      }

      const nodeType = node.data.type;
      const incoming = incomingConnections.get(node.id) || 0;
      const outgoing = outgoingConnections.get(node.id) || 0;

      // Validate based on node type
      switch (nodeType) {
        case 'lb':
        case 'gateway':
          // Load balancer must have incoming connection from user or entry point
          const hasValidIncoming = edges.some(edge => 
            (edge.source === 'user' || edge.source === entryPoint?.id) && 
            edge.target === node.id
          );
          if (!hasValidIncoming) {
            errors.push(`Load Balancer/Gateway "${node.data.serverType}" must have incoming connection from user or entry point`);
            isValid = false;
          }
          if (outgoing === 0) {
            errors.push(`Load Balancer/Gateway "${node.data.serverType}" must have outgoing connections`);
            isValid = false;
          }
          // Load balancer should connect to multiple app servers
          const lbOutgoingToApps = edges.filter(edge => 
            edge.source === node.id && 
            nodes.some(n => n.id === edge.target && (n.data.type === 'app' || n.data.type === 'micro'))
          ).length;
          if (lbOutgoingToApps < 2) {
            warnings.push(`Load Balancer "${node.data.serverType}" should connect to multiple application servers for redundancy`);
          }
          break;

        case 'app':
        case 'micro':
          if (incoming === 0) {
            errors.push(`Application/Microservice "${node.data.serverType}" must have incoming connections`);
            isValid = false;
          }
          // App servers should connect to both cache and database
          const hasCacheConnection = edges.some(edge => 
            edge.source === node.id && 
            nodes.some(n => n.id === edge.target && n.data.type === 'cache')
          );
          const hasDbConnection = edges.some(edge => 
            edge.source === node.id && 
            nodes.some(n => n.id === edge.target && n.data.type === 'db')
          );
          if (!hasCacheConnection) {
            warnings.push(`Application "${node.data.serverType}" should connect to a cache for better performance`);
          }
          if (!hasDbConnection) {
            errors.push(`Application "${node.data.serverType}" must connect to a database`);
            isValid = false;
          }
          break;

        case 'db':
          if (incoming === 0) {
            errors.push(`Database "${node.data.serverType}" must have incoming connections`);
            isValid = false;
          }
          if (outgoing > 0) {
            errors.push(`Database "${node.data.serverType}" should not have outgoing connections`);
            isValid = false;
          }
          // Check for database redundancy
          const dbCount = nodes.filter(n => n.data.type === 'db').length;
          if (dbCount < 2) {
            warnings.push('Consider adding database replication for high availability');
          }
          break;

        case 'cache':
          if (incoming === 0) {
            errors.push(`Cache "${node.data.serverType}" must have incoming connections`);
            isValid = false;
          }
          if (outgoing > 0) {
            warnings.push(`Cache "${node.data.serverType}" typically should not have outgoing connections`);
          }
          // Check for cache redundancy
          const cacheCount = nodes.filter(n => n.data.type === 'cache').length;
          if (cacheCount < 2) {
            warnings.push('Consider adding cache replication for high availability');
          }
          break;

        case 'mq':
          if (incoming === 0) {
            errors.push(`Message Queue "${node.data.serverType}" must have incoming connections`);
            isValid = false;
          }
          if (outgoing === 0) {
            warnings.push(`Message Queue "${node.data.serverType}" typically should have outgoing connections`);
          }
          // Check for message queue redundancy
          const mqCount = nodes.filter(n => n.data.type === 'mq').length;
          if (mqCount < 2) {
            warnings.push('Consider adding message queue replication for high availability');
          }
          break;

        case 'cdn':
          if (incoming === 0) {
            errors.push(`CDN "${node.data.serverType}" must have incoming connections`);
            isValid = false;
          }
          if (outgoing === 0) {
            warnings.push(`CDN "${node.data.serverType}" typically should have outgoing connections`);
          }
          break;

        case 'asg':
          if (incoming === 0) {
            errors.push(`Auto Scaling Group "${node.data.serverType}" must have incoming connections`);
            isValid = false;
          }
          if (outgoing === 0) {
            warnings.push(`Auto Scaling Group "${node.data.serverType}" typically should have outgoing connections`);
          }
          break;
      }
    });

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
  }, [nodes, edges, entryPoint]);

  // Update validation effect
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: []
  });

  useEffect(() => {
    const result = validateFiniteAutomata();
    setValidationResult(result);
  }, [validateFiniteAutomata]);

  // Add edge click handler
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate popup dimensions
    const popupWidth = 120; // min-width from styled component
    const popupHeight = 48; // approximate height
    
    // Calculate position with viewport bounds
    let x = event.clientX;
    let y = event.clientY;
    
    // Ensure popup stays within viewport horizontally
    if (x < popupWidth / 2) {
      x = popupWidth / 2;
    } else if (x > viewportWidth - popupWidth / 2) {
      x = viewportWidth - popupWidth / 2;
    }
    
    // Ensure popup stays within viewport vertically
    if (y < popupHeight) {
      // If near top, show below the click
      y = event.clientY + 10;
    } else {
      // If not near top, show above the click
      y = event.clientY - 10;
    }
    
    setEdgePopupPosition({ x, y });
    setSelectedEdge(edge);
  }, []);

  // Add edge delete handler
  const handleEdgeDelete = useCallback(() => {
    if (selectedEdge) {
      setEdges(edges => edges.filter(edge => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedEdge, setEdges]);

  // Add click outside handler to close edge popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (selectedEdge && !target.closest('.edge-popup') && !target.closest('.react-flow__edge')) {
        setSelectedEdge(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedEdge]);

  // Modify the ReactFlow component
  return (
    <Container onContextMenu={handleContextMenu}>
      <ViewToggle>
        <ToggleButton 
          active={view === 'design'} 
          onClick={() => setView('design')}
        >
          Design View
        </ToggleButton>
        <ToggleButton 
          active={view === 'compare'} 
          onClick={() => setView('compare')}
        >
          Compare Templates
        </ToggleButton>
        <ToggleButton 
          active={showLevelManager} 
          onClick={() => setShowLevelManager(!showLevelManager)}
          style={{
            background: showLevelManager ? '#4a90e2' : 'transparent',
            color: showLevelManager ? 'white' : '#666',
            border: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {showLevelManager ? 'Hide Level Info' : 'Show Level Info'}
        </ToggleButton>
        <ToggleButton 
          active={showControlPanel} 
          onClick={() => setShowControlPanel(!showControlPanel)}
          style={{
            background: showControlPanel ? '#4a90e2' : 'transparent',
            color: showControlPanel ? 'white' : '#666',
            border: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {showControlPanel ? 'Hide Controls' : 'Show Controls'}
        </ToggleButton>
        <ToggleButton 
          active={showMetricsPanel} 
          onClick={() => setShowMetricsPanel(!showMetricsPanel)}
          style={{
            background: showMetricsPanel ? '#4a90e2' : 'transparent',
            color: showMetricsPanel ? 'white' : '#666',
            border: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {showMetricsPanel ? 'Hide Metrics' : 'Show Metrics'}
        </ToggleButton>
        <ToggleButton 
          active={false}
          onClick={resetGame}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: '1px solid #c0392b',
            marginLeft: '8px',
            padding: '6px 16px'
          }}
        >
          Reset Game
        </ToggleButton>
      </ViewToggle>

      {view === 'design' ? (
        <MainContent>
          {showLevelManager && (
            <LevelManager
              currentLevel={currentLevel}
              currentThroughput={simulationResults?.totalThroughput || 0}
              currentCost={calculateTotalCost().total}
              currentLatency={currentLatency}
              currentReliability={currentReliability}
              nodePattern={calculateNodePattern(nodes)}
              onLevelComplete={handleLevelComplete}
            />
          )}
          <FlowContainer>
            <ReactFlow
              nodes={[userNode, ...nodes].map(node => ({
                ...node,
                data: {
                  ...node.data,
                  isStartingPoint: node.id === entryPoint?.id,
                  isUser: node.id === 'user',
                  isEntryPoint: node.id === entryPoint?.id,
                  isDatabase: node.data.type === 'database'
                }
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.5}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              preventScrolling={true}
            >
              <Background />
              <Controls />
              {showConfig && selectedNode && (
                <>
                  <Overlay onClick={() => setShowConfig(false)} />
                  <ConfigPanel>
                    <ServerConfig
                      nodeId={selectedNode.id}
                      resources={selectedNode.data.resources}
                      onClose={() => setShowConfig(false)}
                      onSave={(nodeId, resources) => {
                        setNodes(nodes => nodes.map(node => 
                          node.id === nodeId 
                            ? {
                                ...node,
                                data: {
                                  ...node.data,
                                  resources
                                }
                              }
                            : node
                        ));
                        setShowConfig(false);
                      }}
                      onDelete={() => {
                        // Remove the node
                        setNodes(nodes => nodes.filter(node => node.id !== selectedNode.id));
                        // Remove connected edges
                        setEdges(edges => edges.filter(edge => 
                          edge.source !== selectedNode.id && edge.target !== selectedNode.id
                        ));
                        // If it was the entry point, clear it
                        if (entryPoint?.id === selectedNode.id) {
                          setEntryPoint(null);
                        }
                        setShowConfig(false);
                      }}
                    />
                  </ConfigPanel>
                </>
              )}
              <Legend>
                <LegendItem>
                  <LegendColor color="#e74c3c" />
                  <span>User Entry Point</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor color="#4a90e2" />
                  <span>System Entry Point</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor color="#2ecc71" />
                  <span>Database Node</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor color="#f1c40f" />
                  <span>Potential Failure Point</span>
                </LegendItem>
              </Legend>
            </ReactFlow>
          </FlowContainer>

          {showControlPanel && (
            <ControlPanel>
              <PanelSection>
                <PanelTitle>Architecture Templates</PanelTitle>
                <Select 
                  value={selectedTemplate} 
                  onChange={(e) => {
                    applyTemplate(e.target.value);
                    setSelectedTemplate(''); // Reset after selection
                  }}
                >
                  <option value="">Select a template...</option>
                  
                  <optgroup label="Basic Templates">
                    {groupedTemplates.basic.map(template => (
                      <TemplateOption key={template.name} value={template.name}>
                        {template.name}
                        <CategoryLabel>({template.category})</CategoryLabel>
                      </TemplateOption>
                    ))}
                  </optgroup>

                  <optgroup label="Intermediate Templates">
                    {groupedTemplates.intermediate.map(template => (
                      <TemplateOption key={template.name} value={template.name}>
                        {template.name}
                        <CategoryLabel>({template.category})</CategoryLabel>
                      </TemplateOption>
                    ))}
                  </optgroup>

                  <optgroup label="Advanced Templates">
                    {groupedTemplates.advanced.map(template => (
                      <TemplateOption key={template.name} value={template.name}>
                        {template.name}
                        <CategoryLabel>({template.category})</CategoryLabel>
                      </TemplateOption>
                    ))}
                  </optgroup>
                </Select>
              </PanelSection>

              <PanelSection>
                <PanelTitle>Node Management</PanelTitle>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  marginBottom: '16px' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    flexWrap: 'wrap' 
                  }}>
                    <div style={{ width: '100%', marginBottom: '8px' }}>
                      <Select 
                        value={selectedServerType}
                        onChange={(e) => {
                          const selectedType = serverTypes.find(t => t.name === e.target.value);
                          if (selectedType) {
                            addNewNode(selectedType);
                          }
                          setSelectedServerType(''); // Reset after selection
                        }}
                        style={{ width: '100%', marginBottom: '8px' }}
                      >
                        <option value="">Select server type to add...</option>
                        <optgroup label="Entry Points">
                          {serverTypes.filter(t => ['lb', 'gateway'].includes(t.type)).map(type => (
                            <option key={type.name} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Application Servers">
                          {serverTypes.filter(t => ['app', 'micro'].includes(t.type)).map(type => (
                            <option key={type.name} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Data & Storage">
                          {serverTypes.filter(t => ['db', 'cache', 'mq'].includes(t.type)).map(type => (
                            <option key={type.name} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Infrastructure">
                          {serverTypes.filter(t => ['cdn', 'asg', 'dr'].includes(t.type)).map(type => (
                            <option key={type.name} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </optgroup>
                      </Select>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666', 
                        marginTop: '4px',
                        padding: '8px',
                        background: '#f8f9fa',
                        borderRadius: '4px'
                      }}>
                        {serverTypes[0].description}
                      </div>
                    </div>
                    <Button 
                      onClick={createEntryPoint}
                      disabled={!!entryPoint}
                      style={{ 
                        background: entryPoint ? '#f0f0f0' : '#4a90e2',
                        color: entryPoint ? '#999' : 'white',
                        cursor: entryPoint ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <span>{entryPoint ? 'Entry Point Created' : 'Create Entry Point'}</span>
                    </Button>
                    <Button 
                      onClick={createDatabase}
                      style={{ 
                        background: '#2ecc71',
                        color: 'white'
                      }}
                    >
                      <span>Add Database</span>
                    </Button>
                    <Button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear the current design? This will remove all nodes and connections.')) {
                          setNodes([]);
                          setEdges([]);
                          setNodeId(0);
                          setEntryPoint(null);
                          setSimulationResults(null);
                          setFailurePoints([]);
                          setSelectedNode(null);
                          setShowConfig(false);
                          setValidationErrors([]);
                          setShowValidation(false);
                          setCurrentLatency(0);
                          setCurrentReliability(100);
                          // Reset user node position
                          setUserNode(prev => ({
                            ...prev,
                            position: { x: 50, y: 50 }
                          }));
                        }
                      }}
                      style={{ 
                        background: '#e74c3c',
                        color: 'white',
                        marginLeft: 'auto'
                      }}
                    >
                      <span>Clear Design</span>
                    </Button>
                  </div>
                  {entryPoint && (
                    <div style={{ 
                      padding: '12px', 
                      background: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px solid #4a90e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <strong>Entry Point:</strong> {entryPoint.id}
                      </div>
                      <Button 
                        onClick={() => {
                          setEntryPoint(null);
                          setNodes(nodes => nodes.filter(n => n.id !== entryPoint.id));
                          setEdges(edges => edges.filter(e => 
                            e.source !== entryPoint.id && e.target !== entryPoint.id
                          ));
                        }}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '12px',
                          background: '#e74c3c'
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </PanelSection>

              <PanelSection>
                <PanelTitle>Simulation Settings</PanelTitle>
                <div>
                  <label>Target Throughput (ops/sec):</label>
                  <Input
                    type="number"
                    value={targetThroughput}
                    onChange={(e) => setTargetThroughput(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleSimulation}>Run Simulation</Button>
              </PanelSection>

              {selectedTemplateData && (
                <PanelSection>
                  <PanelTitle>Template Details</PanelTitle>
                  <TemplateDescription>
                    <SectionTitle>Overview</SectionTitle>
                    <p>{selectedTemplateData.description}</p>
                    
                    <SectionTitle>Performance</SectionTitle>
                    <InfoGrid>
                      <InfoItem>
                        <strong>Throughput:</strong> {selectedTemplateData.recommendedThroughput} ops/sec
                      </InfoItem>
                      <InfoItem>
                        <strong>Latency:</strong> {selectedTemplateData.performanceCharacteristics.latency}ms
                      </InfoItem>
                      <InfoItem>
                        <strong>Scalability:</strong> {selectedTemplateData.performanceCharacteristics.scalability}
                      </InfoItem>
                      <InfoItem>
                        <strong>Reliability:</strong> {selectedTemplateData.performanceCharacteristics.reliability}%
                      </InfoItem>
                    </InfoGrid>
                  </TemplateDescription>
                </PanelSection>
              )}
            </ControlPanel>
          )}

          {showMetricsPanel && simulationResults && (
            <MetricsPanel>
              <PanelTitle>Simulation Results</PanelTitle>
              <MetricItem>
                <MetricLabel>Total Throughput</MetricLabel>
                <MetricValue>{simulationResults.totalThroughput} ops/sec</MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>System Health</MetricLabel>
                <MetricValue>{simulationResults.systemHealth.toFixed(1)}%</MetricValue>
              </MetricItem>
              <MetricItem>
                <MetricLabel>Max Achievable</MetricLabel>
                <MetricValue>{simulationResults.maxAchievableThroughput.toFixed(0)} ops/sec</MetricValue>
              </MetricItem>
              {simulationResults.bottleneckNodes.length > 0 && (
                <MetricItem>
                  <MetricLabel>Bottlenecks</MetricLabel>
                  <div>
                    {simulationResults.bottleneckNodes.map(id => (
                      <div key={id} style={{ fontSize: '12px', color: '#666' }}>{id}</div>
                    ))}
                  </div>
                </MetricItem>
              )}
            </MetricsPanel>
          )}

          {showLevelComplete && (
            <>
              <Overlay onClick={() => setShowLevelComplete(false)} />
              <LevelCompleteModal>
                <h2>Level {currentLevel} Complete! 🎉</h2>
                <p>Congratulations! You've completed {levels[currentLevel - 1].name}</p>
                <div style={{ margin: '16px 0' }}>
                  <h3>Rewards Earned:</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {levels[currentLevel - 1].rewards.map((reward, index) => (
                      <li key={index} style={{ margin: '8px 0' }}>{reward}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ margin: '16px 0' }}>
                  <strong>Total Points:</strong> {totalPoints}
                </div>
                {currentLevel < levels.length ? (
                  <Button onClick={handleNextLevel}>Start Next Level</Button>
                ) : (
                  <div>
                    <h3>🎉 Congratulations! 🎉</h3>
                    <p>You've completed all levels!</p>
                    <Button onClick={() => setCurrentLevel(1)}>Start Over</Button>
                  </div>
                )}
              </LevelCompleteModal>
            </>
          )}
        </MainContent>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Select Templates to Compare (Max 3)</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {architectureTemplates.map(template => (
                <ToggleButton
                  key={template.name}
                  active={selectedTemplates.includes(template.name)}
                  onClick={() => {
                    if (selectedTemplates.includes(template.name)) {
                      setSelectedTemplates(prev => prev.filter(t => t !== template.name));
                    } else if (selectedTemplates.length < 3) {
                      setSelectedTemplates(prev => [...prev, template.name]);
                    } else {
                      setShowTemplateLimitWarning(true);
                      setTimeout(() => setShowTemplateLimitWarning(false), 3000);
                    }
                  }}
                  style={{
                    opacity: selectedTemplates.length >= 3 && !selectedTemplates.includes(template.name) ? 0.5 : 1,
                    cursor: selectedTemplates.length >= 3 && !selectedTemplates.includes(template.name) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {template.name}
                </ToggleButton>
              ))}
            </div>
            {showTemplateLimitWarning && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                background: '#fff3cd',
                color: '#856404',
                borderRadius: '4px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚠️ Maximum of 3 templates can be compared at once
              </div>
            )}
            {selectedTemplates.length > 0 && (
              <div style={{ 
                marginTop: '12px',
                padding: '8px 12px',
                background: '#e8f4fd',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#0c5460'
              }}>
                Selected: {selectedTemplates.length}/3 templates
              </div>
            )}
          </div>
          {selectedTemplates.length > 0 && (
            <TemplateComparison
              templates={architectureTemplates.filter(t => 
                selectedTemplates.includes(t.name)
              )}
            />
          )}
        </div>
      )}

      <ValidationStatusDisplay isMinimized={isValidationMinimized}>
        <ValidationStatusTitle isValid={validationResult.isValid}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {validationResult.isValid ? '✓ Valid Architecture' : '✗ Invalid Architecture'}
          </div>
          <ValidationToggleButton 
            onClick={() => setIsValidationMinimized(!isValidationMinimized)}
            title={isValidationMinimized ? "Expand" : "Minimize"}
          >
            {isValidationMinimized ? '▼' : '▲'}
          </ValidationToggleButton>
        </ValidationStatusTitle>
        {!isValidationMinimized && (
          <ValidationStatusList>
            {validationResult.errors.map((error, index) => (
              <ValidationStatusItem key={`error-${index}`} type="error">
                {error}
              </ValidationStatusItem>
            ))}
            {validationResult.warnings.map((warning, index) => (
              <ValidationStatusItem key={`warning-${index}`} type="warning">
                {warning}
              </ValidationStatusItem>
            ))}
          </ValidationStatusList>
        )}
      </ValidationStatusDisplay>

      {selectedEdge && (
        <EdgePopup
          className="edge-popup"
          style={{
            left: edgePopupPosition.x,
            top: edgePopupPosition.y,
            transform: edgePopupPosition.y < 48 ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
          }}
        >
          <EdgePopupTitle>Connection Options</EdgePopupTitle>
          <EdgeButtonGroup>
            <EdgeButton variant="delete" onClick={handleEdgeDelete}>
              <span>🗑️</span>
              Delete
            </EdgeButton>
            <EdgeButton variant="cancel" onClick={() => setSelectedEdge(null)}>
              <span>✕</span>
              Cancel
            </EdgeButton>
          </EdgeButtonGroup>
        </EdgePopup>
      )}
    </Container>
  );
} 