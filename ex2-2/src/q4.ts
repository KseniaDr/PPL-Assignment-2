import { is, map } from 'ramda';
import { Exp, isStrExp, PrimOp, Program, VarDecl } from '../imp/L3-ast';
import { isAppExp, isAtomicExp, isBoolExp, isDefineExp, isIfExp, isLetExp, isLitExp, isNumExp, isPrimOp, isProcExp, isProgram, isVarRef, makeProgram, makeVarDecl,ProcExp, makeProcExp, Binding, CExp, makeIfExp, makeAppExp, makePrimOp, makeVarRef, makeStrExp, makeBoolExp, isCompoundExp, makeLitExp, makeDefineExp } from "../imp/L3-ast";
import { Result, makeFailure, makeOk } from '../shared/result';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => {
    return makeOk(unparsePython(exp));
}

export const PrimOpToPythonString = (exp: PrimOp): string =>{
    return (exp.op==="=") ? "==" :
    exp.op;
}

export const unparsePythonProcExp = (exp: ProcExp) : string =>
{
    return `(lambda ${map((v:VarDecl)=>v.var,exp.args).join(",")} : ${unparsePython(exp.body[0])})`;
}
export const unparsePython = (exp: Program | Exp): string =>
    isBoolExp(exp) ? ((exp.val) ? "true" : "false") :
    isNumExp(exp) ? exp.val.toString() :
    isStrExp(exp) ? exp.val :
    isVarRef(exp) ? exp.var :
    isProcExp(exp) ? unparsePythonProcExp(exp) :
    isIfExp(exp) ? `(${unparsePython(exp.then)} if ${unparsePython(exp.test)} else ${unparsePython(exp.alt)})` :
    (isAppExp(exp) && isProcExp(exp.rator)) ? `${unparsePythonProcExp(exp.rator)}(${map(unparsePython,exp.rands).join(',')})` :
    isAppExp(exp) && isPrimOp(exp.rator) && !(exp.rator.op==="not") ? `(${map(unparsePython,exp.rands).join(` ${PrimOpToPythonString(exp.rator)} `)})`: 
    isAppExp(exp) && isPrimOp(exp.rator) && (exp.rator.op==="not") ? `(not ${map(unparsePython,exp.rands).join(` `)})`:
    (isAppExp(exp) && isVarRef(exp.rator)) ? `${exp.rator.var}(${map(unparsePython,exp.rands).join(',')})` :
    isPrimOp(exp) ? PrimOpToPythonString(exp) :
    isDefineExp(exp) ? `${exp.var.var} = ${unparsePython(exp.val)}` :
    isProgram(exp) ? `${map(unparsePython,exp.exps).join('\n')}` :
    "";
