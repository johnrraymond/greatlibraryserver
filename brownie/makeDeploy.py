import sys
import re

def main(datamine = "TLSC", totalCount=100):
    f = open("deploy.py", "r")
    bookmark = f.read()
    f.close()


    bookmark = re.sub('%s', datamine, bookmark)
    bookmark = re.sub('%f', str(totalCount), bookmark)
    print(bookmark)

    f = open("scripts/deploy" + datamine + ".py", "w")
    f.write(bookmark)
    f.close()


if __name__ == "__main__":
    if len(sys.argv) == 3:
        main(sys.argv[1], int(sys.argv[2]))
    else:
        main(sys.argv[1])
