// <reference path="../../models/refelection.ts" />
// <reference path="../RendererPlugin.ts" />

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
            renderer.on(Renderer.EVENT_BEGIN, this.onRendererBegin, this);
        }

        /**
         * Trigger when the rendering is starting.
         * This will traverse the full document.
         */
        private onRendererBegin(event:OutputEvent) {
            event.project.traverse((item, type) => this.CheckComment(item));
        }
        
        /**
         * Check for our rules on the current model
         */
        private CheckComment(model:td.models.Reflection) {
           
            // if it's 
            // - a class/interface
            // - a function/method
            // and this is
            // - private
            // - non public or non private
            // then skip
            var skip = ((model.kind & td.models.ReflectionKind.ClassOrInterface) || (model.kind & td.models.ReflectionKind.FunctionOrMethod) ) 
                    &&  (model.flags.isPrivate || !( model.flags.isPublic || model.flags.isExported));
            
            if(!skip) {
                
                // only check for signature and other type
                if( model.kind !=td.models.ReflectionKind.ExternalModule && !(model.kind  & td.models.ReflectionKind.FunctionOrMethod ))
                { 
                    if(!model.hasComment()){
                       this.writeErrorMessage(Util.format("Element '%s' does not have comment.", model.name), model);
                    }
                    else
                    {
                        this.CheckForReturnType(model);
                    }
                }
                model.traverse((item, type) => this.CheckComment(item));
            }
        }
        
        private CheckForReturnType(model:td.models.Reflection) : void {
            // if we got a call signature, check for the return type if it's not and not void
            if(model.kind & td.models.ReflectionKind.SomeSignature)
             {  
                var declarationModel = <td.models.DeclarationReflection>model;
            
                var signatureWithReturnType = 
                    td.models.ReflectionKind.CallSignature | td.models.ReflectionKind.IndexSignature | td.models.ReflectionKind.GetSignature; 
                var signatureWithNoReturnType = td.models.ReflectionKind.ConstructorSignature |td.models.ReflectionKind.SetSignature;
            
                
                // so if a return type is needed and defined
                if(( model.kind & signatureWithReturnType) != 0 
                    && (declarationModel.type !== undefined)  
                    && (declarationModel.type.toString() !== "void")
                    && !!!declarationModel.comment.returns)
                {
                    this.writeErrorMessage(Util.format("Element '%s' does not have return tag.", model.name), model);
                }
                
                // so if a return type is possible but not defined
                if(( model.kind & signatureWithReturnType) != 0 
                    && (declarationModel.type === undefined  
                    || (declarationModel.type.toString() === "void"))
                    && !!declarationModel.comment.returns)
                {
                     this.writeErrorMessage(Util.format("Element '%s' does have a useless return tag.", model.name), model);
                }
                
                // so if a return type is needed and defined
                if(( model.kind & signatureWithNoReturnType) != 0 
                    && !!declarationModel.comment.returns)
                {
                    this.writeErrorMessage(Util.format("Element '%s' does have a useless return tag.", model.name), model);
                }
            }
        }
        
        private writeErrorMessage(message: string, model: td.models.Reflection):void {
            
            var sourceModel : td.models.Reflection = model;
            while (sourceModel.sources === undefined || sourceModel.sources.length === 0 )
            {
                sourceModel = sourceModel.parent;
            }
            
            var source = sourceModel.sources[0];
            
            var formatedMesssage = Util.format('%s(%d,%d) : %s', source.fileName, source.line, source.character, message);
            
            if(this.warningNotError)
            { 
                this.renderer.application.logger.warn(formatedMesssage);
            }
            else
            {
                this.renderer.application.logger.error(formatedMesssage);
            }
        }
    }


    /**
     * Register this plugin.
     */
    Renderer.registerPlugin('CommentChecker', CommentCheckerPlugin);
}