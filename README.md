# Chat APP with Supabase + Vue 3

This is a simple chat app built with Vue 3 and Supabase. It uses the following features:

- Supabase (Authentication, Realtime, Storage, Database)
- Vue 3
- Tailwind CSS
- Vue Router
- Vue Composition API
- Pinia

## Getting Started

```bash
# Clone the repo
git clone

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Create a Supabase project and add the URL and anon key to the .env file
```bash
VITE_SUPABASE_URL="https://xxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
You can find the anon key in the API section of your Supabase project.

### Table Structure

First, create a profile table with SQL Editor in your Supabase project.
- Go to the SQL Editor in your Supabase project
- Pick `User Managament Starter` from the Quick Start section
- Run the SQL query

Then create a table called `messages` with the following columns:
```sql
CREATE TABLE messages (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  text TEXT NOT NULL,
  user_id TEXT NOT NULL,
  timestamp timestampz default now() NOT NULL
);
```

Change your Site URL and Redirect URL `Authentication > URL Configuration` section of your Supabase project.


## Deploying

This project is setup to deploy to [Vercel](https://vercel.com/). You can deploy it to Vercel by clicking the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fafsakar%2Fsupabase-chat)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details