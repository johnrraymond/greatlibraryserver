import sys
import re

def main(datamine = "TLSC"):
    f = open("Bookmark.sol", "r")
    bookmark = f.read()
    f.close()


    bookmark = re.sub('%s', datamine, bookmark)
    print(bookmark)

    f = open("contracts/Bookmark" + datamine + ".sol", "w")
    f.write(bookmark)
    f.close()


if __name__ == "__main__":
    main(sys.argv[1])
