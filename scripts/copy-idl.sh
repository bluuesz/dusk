

mkdir -p apps/server/src/idl && mkdir -p apps/server/src/idl/types

cp apps/dusk-program/target/idl/dusk_program.json apps/server/src/idl/dusk_program.json
cp apps/dusk-program/target/types/dusk_program.ts apps/server/src/idl/types/dusk_program.ts

echo "IDLs and Types copied"
