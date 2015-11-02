1. Download and Build MacVim

```bash
git clone https://github.com/b4winckler/macvim

# copy `mvim` binary to the `/usr/local/bin`
cp src/MacVim/mvim /usr/local/bin/mvim

# Follow the guide to build MacVim.app
# https://github.com/b4winckler/macvim/blob/master/README_mac.txt
cd src
./configure --with-features=huge --enable-pythoninterp # ./configure --help # additional info
make  # build the project

# move MacVim.app into Application folder while you are in `src` folder
mv MacVim/build/Release/MacVim.app /Applications

open /Applications/MacVim.app

# Follow trouble shoot guide for smooth out the zsh difference
https://github.com/b4winckler/macvim/wiki/Troubleshooting
```

2. Go-Vim

Once you have done the troubleshooting above, you should have `Go-Vim`.

3. YouCompleteMe

```bash
git clone https://github.com/Valloric/YouCompleteM

git submodule update --init --recursive

brew update
brew install cmake
brew install python3

# If python3 is installed correctly, you should be able to see
python3-config --include
# -I/usr/local/Cellar/python3/3.5.0/Frameworks/Python.framework/Versions/3.5/include/python3.5m -I/usr/local/Cellar/python3/3.5.0/Frameworks/Python.framework/Versions/3.5/include/python3.5m

cmake -G "Unix Makefiles" . ~/.vim/bundle/YouCompleteMe/third_party/ycmd/cpp

cmake --build . --target ycm_support_libs --config Release
```
