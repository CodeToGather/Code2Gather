# Code2Gather

Members of CS3219 Team 32:

- He XinYue
- Wang Luo
- Wen Junhua
- Zhu Hanming

## Project Requirements

This project requires the following installed:

### Node.js v14 LTS

One easy way to install Node is to simply download from [their website](https://nodejs.org/en/).

Another alternative way is to utilise [`nodenv`](https://github.com/nodenv/nodenv). Do check out their `README.md` for OS-specific installation instructions.

### Yarn

Once you have Node installed, simply install Yarn using `npm`:

```sh
npm install --global yarn
```

We will be using Yarn for Node dependency management, as well as for its workspaces functionality, the latter of which will streamline some project-level processes, such as pre-commit checks.

### Python 3.9

Similar to Node, use [`pyenv`](https://github.com/pyenv/pyenv) to make your life easier.

```bash
curl https://pyenv.run | bash
pyenv install 3.9.4 # >= 3.9
pyenv local 3.9.4
```

### Poetry

Install [Poetry](https://python-poetry.org), version 1.1.9.

```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | env POETRY_VERSION=1.1.9 python -
```

Or if you already have Poetry installed, simply run:

```sh
poetry self update
```

Poetry is our choice of dependency manager for our Python packages.

## Setting Up

First, clone this repository:

```sh
git clone https://github.com/CS3219-SE-Principles-and-Patterns/cs3219-project-ay2122-2122-s1-g32.git
```

Then, navigate to the **project root** and install the dependencies:

```sh
cd cs3219-project-ay2122-2122-s1-g32
yarn install
```

> Please do not navigate to the packages/services individually! This single `yarn install` will do the trick.

## Committing

The easiest way to start committing is to run the following command anywhere within the project directory:

```sh
yarn commit
```

You will be guided through an interactive prompt that will help you craft a beautiful commit message, using `commitizen`.
