module Module {
    /** 
     * Sample Code 
     */
    export class Calc {
        // Sample1: empty comment.
        public mul(n1: number, n2: number): number {
            return n1 * n2;
        }

        /**
         * Sample2: lack of param and return.
         * @param n1 number 1
         */
        public sum(n1: number, n2: number): number {
            return n1 + n2;
        }

        /**
         * Sample3: illegal params.
         * @param hoge1 hoge1
         * @param hoge2 hoge2
         * @param hoge3 hoge3
         * @return result
         */
        public div(n1: number, n2: number): number {
            return n1 / n2;
        }
    }
}