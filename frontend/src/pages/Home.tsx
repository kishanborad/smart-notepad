import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, PlusOutlined, ClockCircleOutlined, TagsOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const { Title, Paragraph } = Typography;

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatsCard = styled(Card)`
  background: #fafafa;
  border-radius: 8px;
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual data from your state management
  const stats = {
    totalNotes: 12,
    recentNotes: 3,
    totalTags: 8,
  };

  return (
    <div>
      <Title level={2}>Welcome to Smart Notepad</Title>
      <Paragraph>
        Your intelligent note-taking companion. Create, organize, and manage your notes with ease.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <StatsCard>
            <Statistic
              title="Total Notes"
              value={stats.totalNotes}
              prefix={<FileTextOutlined />}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard>
            <Statistic
              title="Recent Notes"
              value={stats.recentNotes}
              prefix={<ClockCircleOutlined />}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard>
            <Statistic
              title="Total Tags"
              value={stats.totalTags}
              prefix={<TagsOutlined />}
            />
          </StatsCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <StyledCard
            hoverable
            onClick={() => navigate('/notes')}
            cover={<FileTextOutlined style={{ fontSize: 48, padding: 24 }} />}
          >
            <Card.Meta
              title="View Notes"
              description="Browse and manage your existing notes"
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StyledCard
            hoverable
            onClick={() => navigate('/notes/new')}
            cover={<PlusOutlined style={{ fontSize: 48, padding: 24 }} />}
          >
            <Card.Meta
              title="Create Note"
              description="Start a new note"
            />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 