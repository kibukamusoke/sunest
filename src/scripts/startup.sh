#!/bin/sh
# Run migrations
echo "Running database migrations..."
npm run prisma:deploy

# Start the application
echo "Starting application..."
if [ "$RUN_STUDIO" = "true" ]; then
  # Start both Prisma Studio and the main app
  npm run prisma:studio & node dist/main.js
else
  # Start just the main app
  node dist/main.js
fi