import React from 'react';
import styled from '@emotion/styled';
import type { ServerResources } from '../types/architecture';

const ConfigContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  &:hover {
    color: #333;
  }
`;

const ResourceSection = styled.div`
  margin-bottom: 8px;
`;

const ResourceLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
`;

const ResourceInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background: white;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  &:hover {
    background: #357abd;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  &:hover {
    background: #c0392b;
  }
`;

const CostSection = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 8px;
`;

const CostRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin: 4px 0;
`;

const TotalCost = styled(CostRow)`
  font-weight: 600;
  color: #333;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
`;

// Resource costs per unit (monthly)
const resourceCosts = {
  cpu: 50, // $ per GHz
  cpuCores: 20, // $ per core
  memory: 5, // $ per GB
  networkBandwidth: 0.1, // $ per Mbps
};

interface ServerConfigProps {
  nodeId: string;
  resources: ServerResources;
  onClose: () => void;
  onSave: (nodeId: string, resources: ServerResources) => void;
  onDelete: () => void;
}

const serverTypes = [
  { 
    name: 'Default Server', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 16, networkBandwidth: 1000 },
    description: 'Balanced configuration for general workloads'
  },
  { 
    name: 'High Performance', 
    resources: { cpu: 3.6, cpuCores: 8, memory: 32, networkBandwidth: 2500 },
    description: 'Optimized for compute-intensive tasks'
  },
  { 
    name: 'Low Latency', 
    resources: { cpu: 2.8, cpuCores: 6, memory: 24, networkBandwidth: 5000 },
    description: 'Designed for high-speed data processing'
  },
  { 
    name: 'Storage Optimized', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 64, networkBandwidth: 2000 },
    description: 'Optimized for storage-intensive workloads'
  },
  { 
    name: 'Cache Server', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 32, networkBandwidth: 2000 },
    description: 'Designed for high-speed caching'
  },
  { 
    name: 'Edge Server', 
    resources: { cpu: 2.0, cpuCores: 2, memory: 8, networkBandwidth: 500 },
    description: 'Lightweight server for edge computing'
  },
  { 
    name: 'Media Server', 
    resources: { cpu: 3.2, cpuCores: 6, memory: 32, networkBandwidth: 3000 },
    description: 'Optimized for media processing and streaming'
  },
  { 
    name: 'Security Server', 
    resources: { cpu: 2.8, cpuCores: 4, memory: 16, networkBandwidth: 2000 },
    description: 'Designed for security and monitoring'
  },
  { 
    name: 'Analytics Server', 
    resources: { cpu: 3.6, cpuCores: 8, memory: 64, networkBandwidth: 2000 },
    description: 'Optimized for data analysis and processing'
  },
  { 
    name: 'IoT Server', 
    resources: { cpu: 2.4, cpuCores: 4, memory: 16, networkBandwidth: 1000 },
    description: 'Designed for IoT device management'
  },
  { 
    name: 'Gaming Server', 
    resources: { cpu: 3.6, cpuCores: 8, memory: 32, networkBandwidth: 5000 },
    description: 'Optimized for gaming workloads'
  },
  { 
    name: 'E-commerce Server', 
    resources: { cpu: 3.2, cpuCores: 6, memory: 24, networkBandwidth: 2000 },
    description: 'Designed for e-commerce applications'
  },
];

export default function ServerConfig({ nodeId, resources, onClose, onSave, onDelete }: ServerConfigProps) {
  const [localResources, setLocalResources] = React.useState(resources);

  const calculateCost = (resources: ServerResources) => {
    const costs = {
      cpu: resources.cpu * resourceCosts.cpu,
      cpuCores: resources.cpuCores * resourceCosts.cpuCores,
      memory: resources.memory * resourceCosts.memory,
      networkBandwidth: resources.networkBandwidth * resourceCosts.networkBandwidth,
    };
    
    const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    return { costs, total };
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = serverTypes.find(t => t.name === e.target.value);
    if (preset) {
      setLocalResources(preset.resources);
    }
  };

  const { costs, total } = calculateCost(localResources);

  return (
    <ConfigContainer>
      <Title>
        Configure Server
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </Title>

      <ResourceSection>
        <ResourceLabel>CPU (GHz)</ResourceLabel>
        <ResourceInput
          type="number"
          value={localResources.cpu}
          onChange={(e) => setLocalResources(prev => ({ ...prev, cpu: Number(e.target.value) }))}
          min="0.1"
          step="0.1"
        />
      </ResourceSection>

      <ResourceSection>
        <ResourceLabel>CPU Cores</ResourceLabel>
        <ResourceInput
          type="number"
          value={localResources.cpuCores}
          onChange={(e) => setLocalResources(prev => ({ ...prev, cpuCores: Number(e.target.value) }))}
          min="1"
          step="1"
        />
      </ResourceSection>

      <ResourceSection>
        <ResourceLabel>Memory (GB)</ResourceLabel>
        <ResourceInput
          type="number"
          value={localResources.memory}
          onChange={(e) => setLocalResources(prev => ({ ...prev, memory: Number(e.target.value) }))}
          min="1"
          step="1"
        />
      </ResourceSection>

      <ResourceSection>
        <ResourceLabel>Network Bandwidth (Mbps)</ResourceLabel>
        <ResourceInput
          type="number"
          value={localResources.networkBandwidth}
          onChange={(e) => setLocalResources(prev => ({ ...prev, networkBandwidth: Number(e.target.value) }))}
          min="100"
          step="100"
        />
      </ResourceSection>

      <CostSection>
        <CostRow>
          <span>CPU Cost:</span>
          <span>${costs.cpu.toFixed(2)}/month</span>
        </CostRow>
        <CostRow>
          <span>CPU Cores Cost:</span>
          <span>${costs.cpuCores.toFixed(2)}/month</span>
        </CostRow>
        <CostRow>
          <span>Memory Cost:</span>
          <span>${costs.memory.toFixed(2)}/month</span>
        </CostRow>
        <CostRow>
          <span>Network Cost:</span>
          <span>${costs.networkBandwidth.toFixed(2)}/month</span>
        </CostRow>
        <TotalCost>
          <span>Total Monthly Cost:</span>
          <span>${total.toFixed(2)}</span>
        </TotalCost>
      </CostSection>

      <ButtonGroup>
        <SaveButton onClick={() => onSave(nodeId, localResources)}>Save Changes</SaveButton>
        <DeleteButton onClick={onDelete}>Delete Node</DeleteButton>
      </ButtonGroup>
    </ConfigContainer>
  );
} 