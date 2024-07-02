const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
    info: {
        title: "My API",
        description: "Description",
    },
    host: "localhost:2222",
    schemes: ["http"],
    components: {
        schemas: {
            ApiResponse: {
                $status: {
                    "@enum": ["success", "error"],
                },
                $serverTime: new Date("2020-01-01").getTime(),
                $data: {},
            },
            ApiError: {
                $status: "error",
                $serverTime: new Date("2020-01-01").getTime(),
                $data: {
                    code: "string",
                    message: "string",
                },
            },
            User: {
                $id: "1",
                $email: "hello@kzakrzewski.pl",
                $role: { $ref: "#/definitions/Role" },
                profile: { $ref: "#/definitions/Profile" },
            },
            Facility: {
                $id: "1",
                $name: "Facility name",
                $occupancy: [{ $ref: "#/definitions/FacilityOccupancy" }],
            },
            Role: { "@enum": ["ADMIN", "USER", "VISITOR"] },
            Profile: {
                $id: "1",
                $firstName: "Kacper",
                $surname: "Zakrzewski",
                $description: "I'm a programmer",
                $userId: "1",
                avatarUrl: "https://kzakrzewski.pl/avatar.png",
            },
            Authorization: {
                $id: "1",
                $scopeFacility: [{ $id: "1", $name: "Facility name" }],
                $assignedUsers: [{ $id: "1", $email: "hello@kzakrzewski.pl" }],
                $createdAt: new Date("2020-01-01").getTime(),
                $expireAt: new Date("2020-01-01").getTime(),
                $createdByUserId: "1",
                $createdBy: { $email: "hello@kzakrzewski.pl" },
            },
            AuthorizationExtendedFacilities: {
                $id: "1",
                $scopeFacility: [{ $ref: "#/definitions/Facility" }],
                $assignedUsers: ["1", "2", "3"],
                $createdAt: new Date("2020-01-01").getTime(),
                $expireAt: new Date("2020-01-01").getTime(),
                $createdByUserId: "1",
            },
            SuperId: {
                $id: "1",
                pin: "1234",
                $secret: "=SID==my-little-secret",
                studentId: "1",
                identityCardId: "1",
                $userId: "1",
                $validTo: new Date("2020-01-01").getTime(),
            },
            Challenge: {
                $challengeId: "=SID==my-little-secret",
                $createdAt: new Date("2020-01-01").getTime(),
                $validTo: new Date("2020-01-01").getTime(),
                $superIdId: "1",
            },
            FacilityOccupancy: {
                $id: "1",
                $isOccupied: true,
                $facilityId: "1",
                $facility: { $ref: "#/definitions/Facility" },
                $createdAt: new Date("2020-01-01").getTime(),
                $relatedEntryId: "2",
            },
            Entry: {
                $id: "1",
                authorizationId: "1",
                $occupierId: "1",
                $authorizedById: "1",
                $authorizedBy: {
                    $email: "hello@kzakrzewski.pl",
                },
                $occupier: {
                    $email: "hello@kzakrzewski.pl",
                },
                $entryAt: new Date("2020-01-01").getTime(),
                releaseAt: new Date("2020-01-01").getTime(),
                $relatedOccupancy: [
                    { $ref: "#/definitions/FacilityOccupancy" },
                ],
            },
        },
    },
};

const outputFile = "./swagger/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];

/* NOTE: if you use the express Router, you must pass in the 
     'endpointsFiles' only the root file where the route starts,
     such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
