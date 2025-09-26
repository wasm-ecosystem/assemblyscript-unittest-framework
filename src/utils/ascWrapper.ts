import { createMemoryStream, main } from "assemblyscript/asc";

export const compiler = {
  compile: main,
};

export class CompilationError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
    this.name = "CompilationError";
  }
}

export async function ascMain(ascArgv: string[], isTransform: boolean) {
  const stderr = createMemoryStream();
  const { error } = await compiler.compile(ascArgv.concat("--noColors"), { stderr });
  if (error) {
    if (isTransform && error instanceof Error && error.message === "TransformDone") {
      return;
    }
    throw new CompilationError(stderr.toString());
  }
}
