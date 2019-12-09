import os
import sys

class AutoDeploy():
    def __init__(self, sys_argv):
        self.dirname, filename = os.path.split(os.path.abspath(sys.argv[0]))

    def main(self):
        # self.image_name = 'dimension:V201909241530'
        # self._pubilsh_docker()
        print('Auto Deploy Test')


if __name__ == '__main__':
    deploy = AutoDeploy(sys.argv)
    deploy.main()
    # deploy.pubilsh_docker()
