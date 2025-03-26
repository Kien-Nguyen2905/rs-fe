import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BuildingIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
} from 'lucide-react';

export function DashboardPage() {
  const stats = [
    {
      title: 'Total Properties',
      value: '124',
      icon: BuildingIcon,
      change: '+12%',
      description: 'from last month',
    },
    {
      title: 'Active Contracts',
      value: '78',
      icon: FileTextIcon,
      change: '+5%',
      description: 'from last month',
    },
    {
      title: 'Total Users',
      value: '12',
      icon: UsersIcon,
      change: '+2',
      description: 'new this month',
    },
    {
      title: 'Revenue',
      value: '$34,545',
      icon: TrendingUpIcon,
      change: '+18%',
      description: 'from last month',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your real estate operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.change}</span>{' '}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-2 border-b"
                >
                  <div>
                    <div className="font-medium">Property {i}</div>
                    <div className="text-sm text-muted-foreground">
                      Added 2 days ago
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$850,000</div>
                    <div className="text-xs text-muted-foreground">
                      4 bed, 3 bath
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-2 border-b"
                >
                  <div>
                    <div className="font-medium">Contract #{10000 + i}</div>
                    <div className="text-sm text-muted-foreground">
                      Signed on Jan {i + 10}, 2023
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                    Active
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
