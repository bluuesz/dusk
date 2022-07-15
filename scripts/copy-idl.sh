

mkdir -p apps/queue/src/idl && mkdir -p apps/queue/src/idl/types

cp apps/dusk-program/target/idl/dusk_program.json apps/queue/src/idl/dusk_program.json
cp apps/dusk-program/target/types/dusk_program.ts apps/queue/src/idl/types/dusk_program.ts

echo "IDLs and Types copied"
