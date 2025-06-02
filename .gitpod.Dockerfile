FROM gitpod/workspace-full:latest

# Node 20 + pnpm 설치
RUN curl -fsSL https://get.pnpm.io/install.sh | bash -
ENV PNPM_HOME="/home/gitpod/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
