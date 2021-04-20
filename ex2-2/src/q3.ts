import { ClassExp, ProcExp, Exp, Program, makeProcExp, Binding, CExp, makeIfExp, makeAppExp, makePrimOp, makeVarRef, makeStrExp, makeBoolExp, isCompoundExp, makeLitExp, makeDefineExp } from "../src/L31-ast";
import { Result, makeFailure, makeOk, mapResult, bind } from "../shared/result";
import { isAppExp, isAtomicExp, isBoolExp, isDefineExp, isIfExp, isLetExp, isLitExp, isNumExp, isPrimOp, isProcExp, isProgram, isStrExp, isVarRef, makeProgram, makeVarDecl } from "../src/L31-ast";
import { is, map,reduce, reduceRight} from "ramda";
import { isClassExp } from "./L31-ast";
import { makeCompoundSExp } from "../imp/L3-value";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>{
    return makeProcExp(exp.fields,[makeProcExp([makeVarDecl('msg')],[BindingArrayToProcBody(exp.methods)])]);
}

/*
Purpose: Transform bindings[] into a nested if expression
Signature: BindingArrayToProcBody(bindings)
Type: Binding[] => CExp
*/
export const BindingArrayToProcBody = (bindings: Binding[]): CExp =>{
    return reduce((bacc:CExp,bcurr:Binding) =>
    {return makeIfExp(makeAppExp(makePrimOp('eq?'),[makeVarRef('msg'),makeLitExp("'"+bcurr.var.var)]),makeAppExp(bcurr.val,[]),bacc) as CExp;},
    makeBoolExp(false),
    bindings.reverse());
}

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
{
    return isProgram(exp) ? makeOk(makeProgram(map(L31ToL3RE,exp.exps))) :
    isAtomicExp(exp) ? makeFailure("Given atomic expression") :
    makeOk(L31ToL3RE(exp));
}

export const L31ToL3RE = (exp: Exp): Exp =>
{
    return isClassExp(exp) ? class2proc(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var,L31ToL3RE(exp.val) as CExp) :
    isProcExp(exp) ?  makeProcExp(exp.args,map(L31ToL3RE,exp.body) as CExp[]) :
    isIfExp(exp) ? makeIfExp(L31ToL3RE(exp.test) as CExp,L31ToL3RE(exp.then) as CExp,L31ToL3RE(exp.alt) as CExp) :
    isAppExp(exp) ? makeAppExp(L31ToL3RE(exp.rator) as CExp,map(L31ToL3RE,exp.rands) as CExp[]): 
    exp;
}


