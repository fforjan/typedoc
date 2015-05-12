export interface INameInterfaceWithNoComment {
	
	methodWithNoComment(): void;
	
	fieldWithNoComment: number;
}

interface PrivateInterfaceWithNoComment {
	methodWithNoCommentInPrivateInterface(): void;
}
/**
 * Contains error for invalid tags
 */
export interface ParamInvalid {
	
	/**
	 * Empty comment
	 * @param invalid this is an invalid
	 */
	 methodWithWrongParam(param :  boolean) : void;
	 
	 /**
	 * Empty comment
	 */
	 methodWithMissingParam(param :  boolean) : void;
	 
	 /**
	 * Empty comment
	 * 
	 * @param invalid this is an invalid
	 * @param invalid this is an invalid
	 */
	 methodWithDeplicatedParam(param :  boolean) : void;
}
/**
 * this is a random comment on the interface
 */
export class INameInterfaceWithComment {
	/**
     * Constructor short text.
     *
     * @param p1 Constructor param
     * @param p2 Private string property
     * @param p3 Public number property
     * @param p4 Public implicit any property
	 * @return pas grand chose
     */
    constructor(p1, protected p2, public p3:number, private p4:number) {
    }
	
	/**
     * This is a simple member function.
     *
     * It should be inherited by all subclasses.
     *
     * @param name The new name.
     */
    public setName(name:string) {
    }
	
	/**
	 * random comment on method
	 */
	methodWithComment() : void {}
	
	/**
	 * field with comment
	 */
	fieldWithoutComment: number;
	
	/**
	 * Correct methods
	 * 
	 * @param param1 first parameters.
	 * @param param2 second parameters
	 * @see moi kjjllj
	 */
	methodWithCorrectParams(param1: boolean, param2: boolean):void{}
}
