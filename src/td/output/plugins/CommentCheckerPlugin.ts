module td.output
{
    export class CommentCheckerPlugin extends RendererPlugin
    {
        // FIXME : this should be a setting
        private  warningNotError : boolean = true;
        
        /**
         * Create a new LayoutPlugin instance.
         *
         * @param renderer  The renderer this plugin should be attached to.
         */
        constructor(renderer:Renderer) {
            super(renderer);
            renderer.on(Renderer.EVENT_BEGIN, this.onRendererBeginPage, this);
        }

        /**
         * Trigger when the rendering is starting.
         * This will traverse the full document.
         */
        private onRendererBeginPage(event:OutputEvent) {
            event.project.traverse((item, type) => this.CheckComment(item));
        }
        
        /**
         * Check for our rules on the current model
         */
        private CheckComment(model:td.models.Reflection) {
           
            // if it's a class or interface and this is
            // - private
            // - non public or non private
            // then skip
            var skip = (model.kind & td.models.ReflectionKind.ClassOrInterface) &&  (model.flags.isPrivate || !( model.flags.isPublic || model.flags.isExported));
            
            if(  !skip) {
                
                // only check for signature and other stuff
                if( model.kind !=td.models.ReflectionKind.ExternalModule && !(model.kind  & td.models.ReflectionKind.FunctionOrMethod ))
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
                
                
                 model.traverse((item, type) => this.CheckComment(item));
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