import React from 'react';
import styled from '@emotion/styled';
import type { ArchitectureTemplate } from '../data/architectureTemplates';

const ComparisonContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin: 20px;
  max-width: 1200px;
`;

interface ComparisonGridProps {
  columnCount: number;
}

const ComparisonGrid = styled.div<ComparisonGridProps>`
  display: grid;
  grid-template-columns: 200px repeat(${props => props.columnCount}, 1fr);
  gap: 8px;
  margin-top: 16px;
`;

const HeaderCell = styled.div`
  background: #f8f9fa;
  padding: 12px;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
`;

const Cell = styled.div`
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  text-align: center;
`;

const MetricCell = styled(Cell)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

interface MetricValueProps {
  color?: string;
}

const MetricValue = styled.span<MetricValueProps>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.color || '#333'};
`;

const MetricLabel = styled.span`
  font-size: 12px;
  color: #666;
`;

const BestPracticeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`;

interface BestPracticeItemProps {
  impact: 'high' | 'medium' | 'low';
}

const BestPracticeItem = styled.li<BestPracticeItemProps>`
  margin: 4px 0;
  padding: 4px;
  border-left: 3px solid ${props => props.impact === 'high' ? '#e74c3c' : props.impact === 'medium' ? '#f1c40f' : '#2ecc71'};
  background: #f8f9fa;
`;

const CostBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`;

const CostBar = styled.div<{ percentage: number }>`
  height: 8px;
  background: #3498db;
  width: ${props => props.percentage}%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const CostLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
`;

const PerformanceChart = styled.div`
  display: flex;
  align-items: flex-end;
  height: 100px;
  gap: 4px;
  margin-top: 8px;
`;

const ChartBar = styled.div<{ height: number; color: string }>`
  flex: 1;
  background: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
`;

const ComplianceBadge = styled.span`
  background: #3498db;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin: 2px;
  display: inline-block;
`;

const SectionTitle = styled.h3`
  margin: 16px 0 8px;
  color: #333;
  font-size: 16px;
  border-bottom: 2px solid #eee;
  padding-bottom: 4px;
`;

interface TemplateComparisonProps {
  templates: ArchitectureTemplate[];
}

export default function TemplateComparison({ templates }: TemplateComparisonProps) {
  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'latency') {
      return value < 20 ? '#2ecc71' : value < 40 ? '#f1c40f' : '#e74c3c';
    }
    if (metric === 'reliability') {
      return value > 99.99 ? '#2ecc71' : value > 99.9 ? '#f1c40f' : '#e74c3c';
    }
    return '#333';
  };

  const getScalabilityColor = (level: string) => {
    return level === 'high' ? '#2ecc71' : level === 'medium' ? '#f1c40f' : '#e74c3c';
  };

  const getMaintenanceColor = (level: string) => {
    return level === 'low' ? '#2ecc71' : level === 'medium' ? '#f1c40f' : '#e74c3c';
  };

  const maxCost = Math.max(...templates.map(t => t.costEstimate.monthly));

  return (
    <ComparisonContainer>
      <h2>Architecture Template Comparison</h2>
      <ComparisonGrid columnCount={templates.length}>
        <HeaderCell>Metric</HeaderCell>
        {templates.map(template => (
          <HeaderCell key={template.name}>
            {template.name}
            <div style={{ fontSize: '12px', color: '#666' }}>
              {template.category}
            </div>
          </HeaderCell>
        ))}

        <SectionTitle>Basic Information</SectionTitle>
        {templates.map(template => (
          <Cell key={template.name}>
            <div>Complexity: {template.complexity}</div>
            <div>Category: {template.category}</div>
            <div>Recommended Throughput: {template.recommendedThroughput} ops/sec</div>
          </Cell>
        ))}

        <SectionTitle>Cost Analysis</SectionTitle>
        {templates.map(template => (
          <Cell key={template.name}>
            <MetricValue>${template.costEstimate.monthly}/month</MetricValue>
            <MetricLabel>${template.costEstimate.hourly}/hour</MetricLabel>
            <CostBreakdown>
              <CostLabel>
                <span>Compute</span>
                <span>${template.costEstimate.breakdown.compute}</span>
              </CostLabel>
              <CostBar percentage={(template.costEstimate.breakdown.compute / maxCost) * 100} />
              <CostLabel>
                <span>Storage</span>
                <span>${template.costEstimate.breakdown.storage}</span>
              </CostLabel>
              <CostBar percentage={(template.costEstimate.breakdown.storage / maxCost) * 100} />
              <CostLabel>
                <span>Network</span>
                <span>${template.costEstimate.breakdown.network}</span>
              </CostLabel>
              <CostBar percentage={(template.costEstimate.breakdown.network / maxCost) * 100} />
              <CostLabel>
                <span>Maintenance</span>
                <span>${template.costEstimate.breakdown.maintenance}</span>
              </CostLabel>
              <CostBar percentage={(template.costEstimate.breakdown.maintenance / maxCost) * 100} />
            </CostBreakdown>
          </Cell>
        ))}

        <SectionTitle>Performance Metrics</SectionTitle>
        {templates.map(template => (
          <Cell key={template.name}>
            <PerformanceChart>
              <ChartBar 
                height={(template.performanceCharacteristics.latency / 100) * 100} 
                color={getMetricColor(template.performanceCharacteristics.latency, 'latency')}
              />
              <ChartBar 
                height={template.performanceCharacteristics.reliability} 
                color={getMetricColor(template.performanceCharacteristics.reliability, 'reliability')}
              />
              <ChartBar 
                height={template.performanceCharacteristics.scalability === 'high' ? 100 : 
                       template.performanceCharacteristics.scalability === 'medium' ? 66 : 33} 
                color={getScalabilityColor(template.performanceCharacteristics.scalability)}
              />
            </PerformanceChart>
            <div style={{ marginTop: '8px' }}>
              <div>Latency: {template.performanceCharacteristics.latency}ms</div>
              <div>Reliability: {template.performanceCharacteristics.reliability}%</div>
              <div>Scalability: {template.performanceCharacteristics.scalability}</div>
              <div>Maintenance: {template.performanceCharacteristics.maintenanceComplexity}</div>
            </div>
          </Cell>
        ))}

        <SectionTitle>Best Practices</SectionTitle>
        {templates.map(template => (
          <Cell key={template.name}>
            <BestPracticeList>
              {template.bestPractices.map((practice, index) => (
                <BestPracticeItem key={index} impact={practice.impact}>
                  <strong>{practice.title}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>{practice.description}</div>
                </BestPracticeItem>
              ))}
            </BestPracticeList>
          </Cell>
        ))}

        <SectionTitle>Industry Optimizations</SectionTitle>
        {templates.map(template => (
          <Cell key={template.name}>
            {template.industryOptimizations.map((opt, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <strong>{opt.industry}</strong>
                <div style={{ marginTop: '4px' }}>
                  {opt.compliance?.map(comp => (
                    <ComplianceBadge key={comp}>{comp}</ComplianceBadge>
                  ))}
                </div>
                <ul style={{ fontSize: '12px', color: '#666', paddingLeft: '16px' }}>
                  {opt.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Cell>
        ))}
      </ComparisonGrid>
    </ComparisonContainer>
  );
} 