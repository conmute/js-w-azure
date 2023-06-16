import {
    generateBlobSASQueryParameters,
    generateAccountSASQueryParameters,
    BlobSASPermissions,
    AccountSASPermissions,
    AccountSASServices,
    StorageSharedKeyCredential,
    AccountSASResourceTypes,
    BlobSASSignatureValues,
    SASProtocol,
} from "@azure/storage-blob"

function getSharedKeyCredential() {
  // Replace <account-name> and <account-key> with your storage account name and account key
  // const sharedKeyCredential = new StorageSharedKeyCredential('<account-name>', '<account-key>');
  return new StorageSharedKeyCredential(
    process.env.AZURE_BLOB_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_BLOB_STORAGE_KEY
  );
}

export async function generateAccountSASToken() {

  const startsOn = new Date();
  startsOn.setHours(startsOn.getHours() - 1);

  // Set the expiry date/time for the SAS token (e.g., one hour from now)
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);
  // Generate the Account SAS token

  const accountPermissions = new AccountSASPermissions()
  accountPermissions.read = true;
  accountPermissions.write = false;
  accountPermissions.delete = false;
  accountPermissions.list = true

  const accountResourceTypes = new AccountSASResourceTypes()
  accountResourceTypes.container = true
  accountResourceTypes.object = true
  accountResourceTypes.service = true

  const accountServices = new AccountSASServices()
  accountServices.blob = true
  
  const sasAccountToken = generateAccountSASQueryParameters({
    permissions: accountPermissions,
    services: accountServices.toString(),
    resourceTypes: accountResourceTypes.toString(),
    protocol: SASProtocol.HttpsAndHttp,
    startsOn,
    expiresOn: expiryDate,
  }, getSharedKeyCredential())

  return sasAccountToken.toString()
}

export async function generateBlobSASToken({
  containerName
}: {
  containerName: string
}) {
  // Create a BlobSASPermissions object with the necessary permissions
  const permissions = new BlobSASPermissions();
  permissions.read = true; // User can read the blob
  permissions.write = true; // User can write (upload) a new blob
  permissions.delete = true; // User can delete the blob

  const startsOn = new Date();
  startsOn.setHours(startsOn.getHours() - 1);

  // Set the expiry date/time for the SAS token (e.g., one hour from now)
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);

  // Generate the SAS token parameters
  const sasOptions: BlobSASSignatureValues = {
    protocol: SASProtocol.HttpsAndHttp,
    containerName,
    // blobName,
    permissions,
    startsOn, // SAS token is valid immediately
    expiresOn: expiryDate,
    // ipRange: { start: '0.0.0.0', end: '255.255.255.255' }, // Restrict access to specific IP range if needed
    // identifier: userId, // Unique identifier for the user
  };

  // Generate the Blob SAS token
  const sasToken = generateBlobSASQueryParameters(sasOptions, getSharedKeyCredential());

  return sasToken.toString();
}
