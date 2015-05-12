module td.output
{
    export class CommentCheckerPlugin extends RendererPlugin
    {
        // FIXME : this should be a setting
        private  warningNotError : boolean = true;
        private loggingMethod : (text:string, ...args:string[]) => void;
        
        /**
         * Create a new LayoutPlugin instance.
         *
         * @param renderer  The renderer this plugin should be attached to.
         */
        constructor(renderer:Renderer) {
            super(renderer);
            renderer.on(Renderer.EVENT_BEGIN, this.onRendererBeginPage, this);
        }

        private onRendererBeginPage(event:OutputEvent) {
            event.project.traverse((item, type) => this.traversing(item));
        }
        
        private traversing(model:td.models.Reflection) {
            if( !(model.kind  & td.models.ReflectionKind.FunctionOrMethod ))
            { 
                if(!model.hasComment()){
                   this.writeErrorMessage("found element with no comment :", model);
                }
                else 
                {
                    //check for invalid tags
                    if(model.kind & td.models.ReflectionKind.SomeSignature) {
                        
                        var parameters = [];
                        for(var id in (<td.models.SignatureReflection>model).parameters) {
                            var parameter = (<td.models.SignatureReflection>model).parameters[id];
                            if(!parameter.hasComment())
                            {
                                this.writeErrorMessage("found element with empty params", model);
                            }
                        }
                    }
                }
            }
           
           // only traverse if we are a public member
           if(model.flags.isPublic || model.flags.isExported) {
                model.traverse((item, type) => this.traversing(item));
           }
        }
        
        private writeErrorMessage(message: string, model: td.models.Reflection):void {
            if(this.warningNotError)
            { 
                this.renderer.application.logger.warn(message , model.getFullName());
            }
            else
            {
                this.renderer.application.logger.error(message , model.getFullName());;
            }
        }
    }


    /**
     * Register this plugin.
     */
    Renderer.registerPlugin('CommentChecker', CommentCheckerPlugin);
}