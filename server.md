# Backend instructions

### the backend code is located under `src/server/` directory 

### to run it just run the command `npm run server`

### once you run the server it will be listening on port 3000, 
### make POST requests to the endpoints on that port

## Endpoints:
1. {BASE_URL}:3000/new_user
2. {BASE_URL}:3000/new_listing
3. {BASE_URL}:3000/new_comment
4. {BASE_URL}:3000/new_vehicle


- ### new user expects an object contains:
```
    email,
    password,
    firstName,
    lastName,
    username,
    phoneNumber,
    address,
    profileImage,
```

- ### new listing expects an object contains:
```
    title,
    price,
    driverLicense,
    duration,
    creationTime,
    status,
    images,
    vehicle,
```

- ### new vehicle expects an object contains:

```
  model,
  make,
  features,
  quirks,
  VIN,
```

- ### new comment expects an object contains:

```

  authorId,
  listingId,
  parentCommentId,
  content,

```








