npm run pre-deploy && git add ./build ./package.json ./package-lock.json && git commit -m "Uploading to production" && echo "Application built"
git push origin --force development:production && echo "Deployment succeeded"
