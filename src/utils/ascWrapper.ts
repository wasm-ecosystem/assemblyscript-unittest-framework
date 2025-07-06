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

export async function ascMain(ascArgv: string[]) {
  const stderr = createMemoryStream();
  const { error } = await compiler.compile(ascArgv, { stderr });
  if (error) {
    throw new CompilationError(stderr.toString());
  }
}
