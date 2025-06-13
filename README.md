# Checkout the latest release

```bash
# Clone the repository
git clone https://github.com/emjheypb/elizaos-project.git

# This project iterates fast, so we recommend checking out the latest release
git checkout $(git describe --tags --abbrev=0)
# If the above doesn't checkout the latest release, this should work:
# git checkout $(git describe --tags `git rev-list --tags --max-count=1`)
```

# Edit the .env file

Copy .env.example to .env and fill in the appropriate values.

```
cp .env.example .env
```

Note: .env is optional. If you're planning to run multiple distinct agents, you can pass secrets through the character JSON

# Start Eliza

Important! We now use Bun. If you are using npm, you will need to install Bun:
https://bun.sh/docs/installation

```bash
bun install
bun run build 
bun start 
```

### Interact via Browser

Once Eliza is running, access the modern web interface at http://localhost:3000. It has been professionally redesigned and features:

- A welcoming dashboard with a gradient hero section and clear calls-to-action for creating agents and groups.
- Visually enhanced cards for managing agents and groups, including status indicators and member counts.
- Real-time chat capabilities with your agents.
- Character configuration options.
- Plugin management.
- Comprehensive memory and conversation history.
- Responsive design for an optimal experience on various screen sizes.