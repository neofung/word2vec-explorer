
import sys
import os
import cherrypy
from cherrypy.lib.static import serve_file
from explorer import Model

STATIC_DIR = os.path.dirname(os.path.realpath(__file__)) + '/public'
CACHE = {}

class App(object):
    @cherrypy.expose
    def index(self):
        return serve_file(STATIC_DIR + '/index.html', "text/html")


class Explore(object):
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def index(self, query=None, limit='1000', enable_clustering='', num_clusters='30'):
        req = cherrypy.request
        cache_key = '-'.join([query, limit, enable_clustering, num_clusters])
        result = CACHE.get(cache_key, {})
        if len(result) > 0:
            return {'result': CACHE[cache_key], 'cached': True}
        try:
            exploration = self.model.explore(query, limit=int(limit))
            exploration.reduce()
            if len(enable_clustering):
                if (len(num_clusters)):
                    num_clusters = int(num_clusters)
                exploration.cluster(num_clusters=num_clusters)
            result = exploration.serialize()
            CACHE[cache_key] = result
            return {'result': result, 'cached': False}
        except KeyError:
            return {'error': {'message': 'No vector found for ' + query}}
        except Error as e:
            return {'error': {'message': 'Unknown fatal error happened: ' + str(e)}}


if __name__ == '__main__':
    #cherrypy.config.update({'/': {'tools.staticdir.on': True, 'tools.staticdir.dir': STATIC_DIR}})
    app = App()
    app.model = Model(sys.argv[1])
    app.explore = Explore()
    app.explore.model = app.model
    cherrypy.quickstart(app, '/', {'/': {'tools.staticdir.on': True, 'tools.staticdir.dir': STATIC_DIR}})
