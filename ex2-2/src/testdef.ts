import {  evalL3program } from '../imp/L3-eval';
import { Value } from "../imp/L3-value";
import { Result, bind, makeOk } from "../shared/result";
import { parseL3 } from "../imp/L3-ast";
import { listPrim} from "../imp/evalPrimitive";


const evalP = (x: string): Result<Value> =>
    bind(parseL3(x), evalL3program);

console.log(evalP(`(L3 ` + `(define append 
    (lambda(lst1 lst2)
        (if (= lst1 '())
            lst2
            (if (= lst2 '())
                lst1
            (cons (car lst1) (append (cdr lst1) lst2))))
    )
  )` + ` (append (list 1) (list 2 3)) )`));