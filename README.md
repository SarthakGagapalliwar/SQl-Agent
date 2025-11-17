# SQL Agent

An intelligent PostgreSQL query assistant powered by AI. Ask questions in natural language and get SQL queries executed against your database instantly.

![SQL Agent Demo](https://img.shields.io/badge/AI-Powered-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.5-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Compatible-blue) ![Mistral AI](https://img.shields.io/badge/Mistral-AI-orange)

## 🚀 Features

- **Natural Language to SQL**: Convert plain English questions into optimized PostgreSQL queries
- **Real-time Database Queries**: Execute queries directly against your PostgreSQL database
- **Schema-Aware**: Automatically understands your database structure for accurate query generation
- **Streaming Responses**: Real-time AI responses with tool execution visibility
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Tool Visualization**: See schema loading and query execution in real-time

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI/ML**: Mistral AI (Codestral), Vercel AI SDK
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📊 Database Schema

The application includes a sample e-commerce database with:

- **Products Table**: Store product information (name, category, price, stock)
- **Sales Table**: Track sales transactions with customer and regional data

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database (we recommend [Neon](https://neon.tech/))
- Mistral AI API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MISTRAL_API_KEY="your_mistral_api_key_here"
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### Getting Started

#### Option 1: Docker (Recommended) 🐳

1. Clone the repository:

```bash
git clone https://github.com/your-username/sql-agent.git
cd sql-agent
```

2. Copy and configure environment:

```bash
cp .env.docker .env
# Edit .env and add your MISTRAL_API_KEY
```

3. Start with Docker Compose:

```bash
docker compose up -d
docker compose exec app npx drizzle-kit migrate
docker compose exec app npx tsx src/app/db/db.seed.ts
```

4. Open [http://localhost:3000](http://localhost:3000)

**📖 See [DOCKER.md](DOCKER.md) for complete Docker documentation**

#### Option 2: Local Development

1. Clone the repository:

```bash
git clone https://github.com/your-username/sql-agent.git
cd sql-agent
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm run db:generate
pnpm run db:migrate
```

4. Seed the database with sample data:

```bash
pnpm dlx tsx src/app/db/db.seed.ts
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 💬 Usage Examples

Try asking these natural language questions:

- "Show me the top 5 best-selling products"
- "Which products are running low on stock?"
- "What are the total sales by region?"
- "Find all electronics products under $100"
- "Show me sales from the last month"

The AI will automatically:

1. 🔍 Load the database schema
2. 🧠 Generate appropriate SQL queries
3. 📊 Execute queries against your database
4. 📋 Present results in a readable format

## 🏗️ Project Structure

```
sql-agent/
├── src/
│   ├── app/
│   │   ├── api/chat/         # AI chat endpoint
│   │   ├── db/               # Database configuration
│   │   │   ├── schema.ts     # Drizzle schema definitions
│   │   │   ├── index.ts      # Database connection
│   │   │   └── db.seed.ts    # Sample data seeder
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # App layout
│   │   └── page.tsx          # Main chat interface
├── drizzle.config.ts         # Drizzle configuration
├── package.json
└── README.md
```

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MISTRAL_API_KEY`
   - `DATABASE_URL`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sql-agent)

## 🔧 Database Migration

When you modify the schema:

```bash
# Generate migration files
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# View data in Drizzle Studio
pnpm run db:studio
```

## 🎯 Features in Detail

### AI-Powered Query Generation

- Uses Mistral's Codestral model for SQL generation
- Schema-aware: Always queries schema before generating SQL
- Safety: Only allows SELECT queries (no data modification)

### Real-time Tool Execution

- Visual feedback for schema loading
- Query execution tracking
- Results display with row counts

### Modern Architecture

- Server-side streaming with Vercel AI SDK
- Type-safe database operations with Drizzle
- Responsive design with Tailwind CSS

## 📝 API Reference

### Chat Endpoint

`POST /api/chat`

Accepts natural language messages and returns streaming AI responses with tool executions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mistral AI](https://mistral.ai/) for the powerful language model
- [Vercel](https://vercel.com/) for the AI SDK and hosting
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Drizzle](https://orm.drizzle.team/) for the excellent TypeScript ORM

---

Built with ❤️ using Next.js and AI
