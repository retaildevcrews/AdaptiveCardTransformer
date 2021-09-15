# [Choice] Node version: 16, 14, 12
ARG VARIANT="16"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

COPY ./scripts /tmp/scripts

RUN apt-get update \
    # Install Docker CLI
    && bash /tmp/scripts/docker-debian.sh \
    # Install CI tools
    && bash /tmp/scripts/install-ci-tools.sh \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts \
    && rm -rf /tmp/scripts

ENTRYPOINT ["/usr/local/share/docker-init.sh"]
CMD ["sleep", "infinity"]
