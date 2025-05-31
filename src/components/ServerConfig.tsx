import React from 'react';
import styled from '@emotion/styled';
import type { ServerResources } from '../types/architecture';

const ConfigContainer = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 300px;
`;

const Title = styled.h3`
  margin: 0 0 16px;
  color: #333;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  color: #666;
  font-size: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 8px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 16px;
  &:hover {
    background: #357abd;
  }
`;

const ResourceValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const ValueDisplay = styled.span`
  color: #333;
  font-weight: 500;
`;

const Unit = styled.span`
  color: #666;
  font-size: 12px;
`;

const CostDisplay = styled.div`
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
`;

const CostItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  color: #666;
`;

const TotalCost = styled.div`
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

interface ServerConfigProps {
  nodeId: string;
  resources: ServerResources;
  onClose: () => void;
  onSave: (nodeId: string, resources: ServerResources) => void;
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

export default function ServerConfig({ nodeId, resources, onClose, onSave }: ServerConfigProps) {
  const [config, setConfig] = React.useState<ServerResources>(resources);

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
      setConfig(preset.resources);
    }
  };

  const handleInputChange = (field: keyof ServerResources) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    onSave(nodeId, config);
    onClose();
  };

  const { costs, total } = calculateCost(config);

  return (
    <ConfigContainer>
      <Title>
        Server Configuration
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </Title>

      <FormGroup>
        <Label>Server Type</Label>
        <Select onChange={handlePresetChange}>
          <option value="">Custom Configuration</option>
          {serverTypes.map(type => (
            <option key={type.name} value={type.name}>
              {type.name}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>CPU Speed (GHz)</Label>
        <Input
          type="number"
          step="0.1"
          value={config.cpu}
          onChange={handleInputChange('cpu')}
        />
      </FormGroup>

      <FormGroup>
        <Label>CPU Cores</Label>
        <Input
          type="number"
          step="1"
          value={config.cpuCores}
          onChange={handleInputChange('cpuCores')}
        />
      </FormGroup>

      <FormGroup>
        <Label>Memory (GB)</Label>
        <Input
          type="number"
          step="1"
          value={config.memory}
          onChange={handleInputChange('memory')}
        />
      </FormGroup>

      <FormGroup>
        <Label>Network Bandwidth (Mbps)</Label>
        <Input
          type="number"
          step="100"
          value={config.networkBandwidth}
          onChange={handleInputChange('networkBandwidth')}
        />
      </FormGroup>

      <FormGroup>
        <Label>Current Configuration</Label>
        <ResourceValue>
          <ValueDisplay>{config.cpu} GHz</ValueDisplay>
          <Unit>× {config.cpuCores} cores</Unit>
        </ResourceValue>
        <ResourceValue>
          <ValueDisplay>{config.memory} GB</ValueDisplay>
          <Unit>RAM</Unit>
        </ResourceValue>
        <ResourceValue>
          <ValueDisplay>{config.networkBandwidth} Mbps</ValueDisplay>
          <Unit>Network</Unit>
        </ResourceValue>
      </FormGroup>

      <CostDisplay>
        <CostItem>
          <span>CPU Cost:</span>
          <span>${costs.cpu.toFixed(2)}/month</span>
        </CostItem>
        <CostItem>
          <span>CPU Cores Cost:</span>
          <span>${costs.cpuCores.toFixed(2)}/month</span>
        </CostItem>
        <CostItem>
          <span>Memory Cost:</span>
          <span>${costs.memory.toFixed(2)}/month</span>
        </CostItem>
        <CostItem>
          <span>Network Cost:</span>
          <span>${costs.networkBandwidth.toFixed(2)}/month</span>
        </CostItem>
        <TotalCost>
          <span>Total Monthly Cost:</span>
          <span>${total.toFixed(2)}</span>
        </TotalCost>
      </CostDisplay>

      <Button onClick={handleSave}>Save Configuration</Button>
    </ConfigContainer>
  );
} 