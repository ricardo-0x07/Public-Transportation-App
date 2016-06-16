/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. 
    */
    xdescribe("app.Project Model", function() {
      var PTL13MOH2015;

        beforeEach(function() {
            PTL13MOH2015 = new app.Project({
                name: 'PTL13MOH2015',
                description: '501D5 Major Inspection in 2015',
                value: 1265000
            });
        });
        it("have default properties such as name, description, value, and ", function() {
            expect(PTL13MOH2015.defaults).toBeDefined();
            expect(PTL13MOH2015.defaults.name).toBeDefined();
            expect(PTL13MOH2015.defaults.description).toBeDefined();
            expect(PTL13MOH2015.defaults.value).toBeDefined();
        });
        it("has a custom event ", function() {
            var myObject = {
                aFakeCallback: function() {
                    return true;
                }
            };
            spyOn(myObject, 'aFakeCallback');
            PTL13MOH2015.on('customEvent', myObject.aFakeCallback);
            PTL13MOH2015.triggerCustomEvent();
            expect(myObject.aFakeCallback).toHaveBeenCalled();
        });
    });

    xdescribe("app.ProjectView ", function() {
        var   PTL13MOH2015, projectView;

        beforeEach(function() {
            PTL13MOH2015 = new app.Project({
                name: 'PTL13MOH2015',
                description: '501D5 Major Inspection in 2015',
                value: 1265000
            });
            spyOn(app.ProjectView.prototype, 'render').and.callThrough();

            projectView = new app.ProjectView({
                model: PTL13MOH2015
            });
        });
        it("uses the click #saveProject event that triggers the save project method.", function() {
            expect(projectView.events['click #saveProject']).toBeDefined();
            expect(projectView.events['click #saveProject']).toEqual('saveProject');
        });
        it("uses a click .delete event that triggers a delete method to delete the current project.", function() {
            expect(projectView.events['click .delete']).toBeDefined();
            expect(projectView.events['click .delete']).toEqual('deleteProject');
        });
        it("uses a focus #service event that loads service suggestions.", function() {
            expect(projectView.events['focus #service']).toBeDefined();
            expect(projectView.events['focus #service']).toEqual('getAutocomplete');
        });
        it("uses a jQuery UI autocompleteselect event that triggers the handleFindSelect method that identifies the selected service and assigns it to the current project.", function() {
            expect(projectView.events['autocompleteselect']).toBeDefined();
            expect(projectView.events['autocompleteselect']).toEqual('handleFindSelect');
        });
        it("calls its render method when its project model has been changed.", function() {
            PTL13MOH2015.set('completed', true);
            expect(projectView.render).toHaveBeenCalled();
        });
        describe('Changes the DOM , ', function() {
            /* This is our first test - it tests to make sure that the
             * allFeeds variable has been defined and that it is not
             * empty. Experiment with this before you get started on
             * the rest of this project. What happens when you change
             * allFeeds in app.js to be an empty array and refresh the
             * page?
             */
            beforeEach(function(done) {
                newBtn = $('#myNavbar > ul > li:nth-child(3) > a').eq(0);
                newBtn.trigger('click');
                newProject = $('a.newProject').eq(0);
                newProject.trigger('click');
                    setTimeout(function() {
                    done();
                }, 1000);
            });
            /* This test checks that the contents of the project view 
             * template have been loaded when the new project is selected 
             */
            it('by rendering the view into the content container when New project drop-down link is clicked', function() {
                expect($('.content')[0].innerHTML).toContain('<button id="saveProject">Save</button>');
            });

            describe('saves the new project when', function() {
                beforeEach(function(done) {
                        $('#name').val('PTL13MOH2015');
                        $('#description').val('Major Inspection of 501DFA Gas Turbine');
                        $('#value').val(1265000);
                        $('#plannedStartDate').val('2015-09-14');
                        $('#plannedFinishDate').val('2015-11-04');
                        $('#actualStartDate').val('2015-09-17');
                        $('#actualFinishDate').val('2015-12-04');

                        originalNoProject = app.projects.length;
                        saveBtn = $('#saveProject').eq(0);

                        saveBtn.trigger('click');

                        setTimeout(function() {
                            done();
                        }, 1000);
                });

                /* This test checks that the contents of the project view 
                 * template have been loaded when the new project is selected 
                 */
                it(' the save button is clicked', function() {
                    newNoProject = app.projects.length;
                    expect(originalNoProject).toBeLessThan(newNoProject);
                //     expect('add').toHaveBeenTriggeredOn('#btnHideMessage');
                });

                afterEach(function() {
                  app.projects.reset(null);
                });


            });
        });
    });

    xdescribe('Project list view', function() {
        var projects, project, PTL13MOH2015, portfolioView, projectSummaryView;
        beforeEach(function() {

            app.projects.fetch({reset: true});
            PTL13MOH2015 = new app.Project({
                name: 'PTL13MOH2015',
                description: '501D5 Major Inspection in 2015',
                value: 1265000,
                completed: false
            });
            // project = app.projects.at(0);
            spyOn(app.ProjectsListView.prototype, 'render').and.callThrough();
            spyOn(app.ProjectSummaryView.prototype, 'render').and.callThrough();
            spyOn(app.ProjectsListView.prototype, 'addOne');

            projectSummaryView = new app.ProjectSummaryView({
                model: PTL13MOH2015
            });
            portfolioView = new app.ProjectsListView({
                model: app.projects
            });
        });

        it(" calls the render method when the collection is reset.", function() {
            app.projects.reset();
            expect(portfolioView.render).toHaveBeenCalled();
        });

        /* This test checks that the contents of the project view 
         * template have been loaded when the new project is selected 
         */
        it(' calls the addOne method when a Project is added to its collection and an additional project summary list item is created for that project.', function() {
            var oldLength, newLength;
            oldLength = $('a.project_summary').length;
            app.projects.add({name: 'PTL14MOH2018'});
            newLength = $('a.project_summary').length;
            expect(portfolioView.addOne).toHaveBeenCalled();
            expect(newLength - oldLength).toEqual(1);
        });

        describe('Project summary view', function() {

            xit(" has a click event that allows the selection of the project it renders.", function() {
                expect(projectSummaryView.events['click a.project_summary']).toBeDefined();
                expect(projectSummaryView.events['click a.project_summary']).toEqual('on_click');
            });

            it("calls its render method when its model attribute(s) are changed", function() {
                PTL13MOH2015.set('completed', true);
                expect(projectSummaryView.render).toHaveBeenCalled();
            });
        });

    });

    xdescribe('Router', function() {
        var trigger = {trigger: true};
        // var MockRuter;

        beforeAll(function() {
            // This is the trick, right here:
            // The Backbone history code dodges our spies
            // unless we set them up exactly like this:
            Backbone.history.stop(); //stop the router
            spyOn(app.Router.prototype, 'home'); //spy on our routes, and they won't get called
            spyOn(app.Router.prototype, 'newProject'); 
            spyOn(app.Router.prototype, 'projectDetails'); 
            spyOn(app.Router.prototype, 'showDueDiligence'); 
            app.projects.fetch({reset: true});

            app.MockRouter = new app.Router(); // Set up the spies _before_ creating the router
            Backbone.history.start();
        });
        it('empty route routes to home', function(){
           app.MockRouter.navigate("", trigger);
           expect(app.MockRouter.home).toHaveBeenCalled();
        });
        it('/projects/new routes to newProject', function(){
            app.MockRouter.navigate('projects/new', trigger);
            expect(app.MockRouter.newProject).toHaveBeenCalled();
        });

        it('projects/id routes to project with id', function(){
            id = app.projects.at(0).id;
            app.MockRouter.navigate('projects/'+ id, trigger);
            expect(app.MockRouter.projectDetails).toHaveBeenCalled(); //With(app.projects.at(1).id,app.projects.at(1));
        });
        xit('diligence routes to the list of projects for due diligence', function(){
            app.sortRouter.navigate('diligence', trigger);
            expect(app.MockRouter.showDueDiligence).toHaveBeenCalled();
        });
        xit('diligence/:id routes to project due diligence', function(){
            app.MockRouter .navigate('diligence/:id', trigger);
            expect(app.MockRouter.showProjectDueDiligence).toHaveBeenCalledWith(':id');
        });
    });
}());
