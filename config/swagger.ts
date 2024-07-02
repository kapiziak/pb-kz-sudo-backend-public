export const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "pb-kz-sudo",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Kacper Zakrzewski",
                url: "https://kzakrzewski.pl",
                email: "hello@kzakrzewski.pl",
            },
        },
        servers: [
            {
                url: "http://localhost:2222",
            },
        ],
    },
    apis: ["./swagger/swagger-output.json"],
};
