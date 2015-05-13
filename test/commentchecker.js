var TypeDoc = require("../bin/typedoc.js");
var FS = require("fs-extra");
var Path    = require("path");
var Assert  = require("assert");

describe('CommentChecker', function() {
    var src = Path.join(__dirname, '..', 'examples', 'commentchecker', 'src');
    var out = Path.join(__dirname, '..', 'tmp', 'test', 'commentchecker');
    var app, project;

    before(function() {
        FS.removeSync(out);
    });

    after(function(){
        FS.removeSync(out);
    });

    it('constructs', function() {
        app = new TypeDoc.Application({
            mode:   'Modules',
            target: 'ES5',
            module: 'CommonJS',
            noLib:  true
        });
        
        app.logger = new TypeDoc.CallbackLogger(function() {});
    });

    it('converts comment checker', function() {
        this.timeout(0);
        var input = app.expandInputFiles([src]);
        project = app.convert(input);

        Assert.equal(app.logger.errorCount, 0, 'Application.convert returned errors');
        Assert(project instanceof TypeDoc.models.ProjectReflection, 'Application.convert did not return a reflection');
    });

    it('renders comment checker example', function() {
        this.timeout(0);
        var result = app.generateDocs(project, out);
        Assert.equal(result, true, 'Application.generateDocs returned errors');	
        Assert.equal(app.logger.warningCount, 15, 'Application.convert returned incorrect warnins');
        
        FS.removeSync(Path.join(out, 'assets'));
	});
});
