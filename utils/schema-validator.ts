import fs from 'fs/promises'
import path from 'path'
import Ajv from 'ajv';
import { createSchema } from 'genson-js';


const ajv = new Ajv({allErrors: true});


const SCHEMA_BASE_PATH = './response-schemas';

export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`);

    if(createSchemaFlag) await generateNewSchema(responseBody, schemaPath);
    const schema = await loadSchema(schemaPath);
    const validate = ajv.compile(schema);

    const valid = validate(responseBody)
    if(!valid) { 
        throw new Error(
            `Schema validation ${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual Response Body:\n` +
            `${JSON.stringify(responseBody, null, 4)}` 
        )
    }
}


async function loadSchema(schemaPath: string) {
    try {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    return JSON.parse(schemaContent);
    }   catch (error) {
        throw new Error(`Failed to load schema from ${schemaPath}: ${(error as Error).message}`);
    }
}

async function generateNewSchema(responseBody: object, schemaPath: string) {

     try {
        const generatedSchema = createSchema(responseBody);
        await fs.mkdir(path.dirname(schemaPath), { recursive: true });
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4));
        }

        catch(error) {
            throw new Error(`Failed to create schema at ${schemaPath}: ${(error as Error).message}`);
        }

}