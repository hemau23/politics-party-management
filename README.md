# Panna Pramukh Management Platform

A comprehensive mobile-first political party management platform built with React, Supabase, and Clerk for managing grassroots political engagement from Party President down to Panna Pramukh level.

## 🚀 Features

### User Roles & Authentication
- **Admin**: Complete system oversight with booth and panna pramukh management
- **Panna Pramukh**: Voter management and activity tracking for assigned booths
- Secure authentication via Clerk with OTP/passwordless options

### Core Functionality

#### For Admins
- 📊 **Dashboard Overview**: Real-time metrics and performance heatmaps
- 🗳️ **Booth Management**: Create and manage polling booths
- 👥 **Panna Pramukh Management**: Assign multiple booths to panna pramukhs
- 📈 **Performance Visualization**: Interactive heatmaps showing booth performance
- 📋 **Comprehensive Reports**: Export data in Excel, CSV, PDF formats
- 🔍 **Drill-down Navigation**: Global → Booth → Panna → Voter level insights

#### For Panna Pramukhs
- 🏠 **Voter Database**: Detailed voter information with categorization
- 📱 **Activity Tracking**: Log visits, calls, WhatsApp messages, rallies
- 📍 **Geo-tagging**: Location-based activity verification
- 🎯 **Voter Categorization**: Supporter/Swing/Opposition classification
- 📞 **Communication Tools**: Direct calling and WhatsApp integration
- 📊 **Personal Dashboard**: Performance metrics for assigned booths

### Voter Management System
- **Comprehensive Profiles**: Name, age, gender, family details, contact info
- **Political Intelligence**: Voting history, inclination tracking
- **Engagement History**: Complete activity log with timestamps
- **Issue Tracking**: Local problems (roads, water, electricity)
- **Smart Categorization**: Automated supporter/swing/opposition grouping

### Real-time Features
- 🔄 **Live Updates**: Supabase real-time subscriptions
- 📱 **Mobile Optimized**: Touch-friendly responsive design
- 🌐 **Offline Support**: Local caching with sync capabilities
- 🔒 **Secure Access**: Row-level security with role-based permissions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL with Row-Level Security)
- **Authentication**: Clerk (OTP, passwordless, social login)
- **Charts**: Recharts for heatmaps and analytics
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready configuration

## 📊 Database Schema

### Core Tables
- **users**: User profiles with role-based access
- **booths**: Polling booth information
- **panna_assignments**: Many-to-many booth assignments
- **voters**: Comprehensive voter database
- **activities**: Activity tracking with geo-tagging
- **issues**: Local issue management
- **metrics**: Calculated performance metrics

### Security Features
- Row-Level Security (RLS) on all tables
- Role-based data access policies
- Secure API endpoints with authentication
- Data encryption and privacy compliance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Clerk account

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd panna-pramukh-platform
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

3. **Database Setup**
   - Click "Connect to Supabase" in the app
   - Run the migration file in your Supabase SQL editor
   - Sample data will be automatically inserted

4. **Start Development**
   ```bash
   npm run dev
   ```

### Deployment

Deploy to Vercel with one click:
```bash
npm run build
# Deploy to Vercel
```

## 📱 Mobile-First Design

- **Responsive Layout**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Fast Loading**: Optimized for slow network connections
- **Offline Capable**: Works without internet connectivity
- **Progressive Web App**: Install on mobile devices

## 🎯 Panna Pramukh Workflows

### Daily Activities
1. **Door-to-Door Visits**: 5 families every 2 days
2. **Digital Outreach**: WhatsApp and call campaigns
3. **Issue Logging**: Record local infrastructure problems
4. **Rally Participation**: Bring voters to political events

### Voter Engagement Strategy
- **Supporters**: Ensure 100% turnout mobilization
- **Swing Voters**: Build relationships, meet twice before polling
- **Opposition**: Monitor influence, avoid energy waste

### Election Day Features
- **Transport Coordination**: Arrange elderly/disabled voter transport
- **Hourly Turnout Tracking**: Real-time booth monitoring
- **Personal Reminders**: Direct swing voter engagement
- **Live Updates**: Send real-time booth status to admin

## 📊 Analytics & Reporting

### Performance Metrics
- Coverage percentage by booth
- Supporter vs. swing vs. opposition ratios
- Youth and first-time voter engagement
- Issue resolution tracking
- Activity completion rates

### Visualization Features
- **Interactive Heatmaps**: Color-coded booth performance
- **Trend Analysis**: Historical performance tracking
- **Comparative Reports**: Cross-booth performance analysis
- **Export Options**: Excel, CSV, PDF report generation

## 🔒 Security & Privacy

- **Data Encryption**: All data encrypted in transit and at rest
- **Role-Based Access**: Strict permission controls
- **Audit Logging**: Complete activity tracking
- **Privacy Compliance**: GDPR and local privacy law adherence
- **Secure Authentication**: Multi-factor authentication support

## 🌟 Key Benefits

- **Scalable Architecture**: Supports thousands of panna pramukhs
- **Real-time Coordination**: Instant communication and updates
- **Data-Driven Decisions**: Comprehensive analytics and insights
- **Mobile Accessibility**: Works on any smartphone or tablet
- **Cost-Effective**: Reduces manual coordination overhead
- **Transparent Operations**: Complete activity visibility

## 📞 Support & Documentation

For technical support or feature requests, please contact the development team or create an issue in the repository.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.