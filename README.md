
## Setup

To install all Python depenencies:

```bash
pip install -r requirements.txt
```

## Usage

Load the explorer with a Word2Vec model:

```bash
./explore GoogleNews-vectors-negative300.bin
```

Now point your browser at [localhost:8080](http://localhost:8080/) to load the explorer!

## Obtaining Pre-Trained Models

The classic example of Word2Vec is the Google News model trained on 600M sentences: [GoogleNews-vectors-negative300.bin.gz](https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?usp=sharing)

Some more pre-trained models provided [here](https://github.com/3Top/word2vec-api#where-to-get-a-pretrained-models).


## Development

In order to make changes to the user interface you will need some NPM dependencies:

```bash
npm install
npm start
```

The command `npm start` will automatically transpile and bundle any code changes in the `ui/` folder. All backend code can be found in `explorer.py` and `./explore`.

Before submitting code changes make sure all code is compliant with StandardJS as well as Pep8:

```bash
standard
pep8 --max-line-length=100 *.py explore
```

## Todo

- Add documentation
- Make sure axes stay when zooming/panning scatterplot
- Autocomplete in query interface
- Drill-down of vector that shows real distance between neighbors
- 3D GPU/WebGL view (on branch `3d`)
- Improved sample rated view that takes into account term counts and connectedness
