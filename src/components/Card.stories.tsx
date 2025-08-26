import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  StatsCard,
} from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardContent>
        <p>This card only has content without header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Header Only</CardTitle>
        <CardDescription>This card only has a header</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const FooterOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardContent>
        <p>Content here</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="mr-2">
          Cancel
        </Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatsCardExample: Story = {
  // render: (args) => (
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <StatsCard
        title="Total Users"
        value="12,345"
        change="+12%"
        changeType="positive"
        className="w-full"
      />
      <StatsCard
        title="Revenue"
        value="$45,678"
        change="-3%"
        changeType="negative"
        className="w-full"
      />
      <StatsCard
        title="Orders"
        value="1,234"
        change="0%"
        changeType="neutral"
        className="w-full"
      />
    </div>
  ),
};

export const MultipleCards: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Feature 1</CardTitle>
          <CardDescription>Description for feature 1</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for feature 1</p>
        </CardContent>
      </Card>

      <Card {...args}>
        <CardHeader>
          <CardTitle>Feature 2</CardTitle>
          <CardDescription>Description for feature 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for feature 2</p>
        </CardContent>
      </Card>
    </div>
  ),
};
