#!/bin/bash
cd /home/kavia/workspace/code-generation/candidate-match-platform-133245-133255/express_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

