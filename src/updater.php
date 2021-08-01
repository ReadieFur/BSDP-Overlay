<?php
require_once __DIR__ . '/../../api/github/cloner/clone.php';
require_once __DIR__ . '/../../api/essentials.php';

//Ensure the script has write permissions. chown -R www-data:www-data <path>

global $payload;

if (
    $payload !== null &&
    $payload->head_commit !== null &&
    $payload->after !== null &&
    $payload->repository !== null
)
{
    $branch = $payload->ref;
    $branch = explode('/', $branch);
    $branch = $branch[count($branch) - 1];

    if ($branch === 'closed-beta' && $payload->after === $payload->head_commit->id)
    {
        GitCloner::CloneFiles($payload->repository->owner->login, $payload->repository->name, $branch, $payload->head_commit->added, __DIR__ . '/_update');
        GitCloner::CloneFiles($payload->repository->owner->login, $payload->repository->name, $branch, $payload->head_commit->modified, __DIR__ . '/_update');
        
        if (file_exists(__DIR__ . '/_update/src'))
        {
            MoveFiles($payload->head_commit->added);
            MoveFiles($payload->head_commit->modified);
        }
        Essentials::RecursiveDelete(__DIR__ . '/_update');
        rmdir(__DIR__ . '/_update'); //I couldn't fit this at the bottom of the if statement in the RecursiveDelete function for some reason, php would give a warning.

        foreach ($payload->head_commit->removed as $file)
        {
            $pathExploded = explode('/', $file);

            if ($pathExploded[0] === 'src')
            {
                $fileName = array_pop($pathExploded);
                array_shift($pathExploded);
                $filePath = __DIR__ . '/' . join('/', $pathExploded);

                if (file_exists($filePath . '/' . $fileName))
                {
                    unlink($filePath . '/' . $fileName);

                    if (scandir(dirname($filePath)) == array('.', '..'))
                    {
                        rmdir(dirname($filePath . '/' . $fileName));
                    }
                }
            }
        }

        exec("pnpm install", $pnpmOutput, $pnpmCode);
        if ($pnpmCode !== 0) { Essentials::Error(new Exception("Failed to install packages. Exited with code: $pnpmCode")); }
        Essentials::Log(implode('<br>', $pnpmOutput));

        exec("sass --style compressed --no-source-map --no-stop-on-error " . __DIR__, $sassOutput, $sassCode);
        if ($sassCode !== 0) { Essentials::Error(new Exception("Failed to compile sass. Exited with code: $sassCode")); }
        Essentials::Log(implode('<br>', $sassOutput));

        exec("tsc --build tsconfig.json", $tscOutput, $tscCode);
        if ($tscCode !== 0) { Essentials::Error(new Exception("Failed to compile typescript. Exited with code: $tscCode")); }
        Essentials::Log(implode('<br>', $tscOutput));
    }
}

function MoveFiles($files)
{
    foreach ($files as $file)
    {
        try
        {
            $pathExploded = explode('/', $file);

            if ($pathExploded[0] === 'src')
            {
                $fileName = array_pop($pathExploded);
                array_shift($pathExploded);
                $filePath = __DIR__ . '/' . join('/', $pathExploded);
                if (!file_exists($filePath))
                {
                    mkdir($filePath, 0777, true);
                }
        
                Essentials::Log("Moving _update/$file to $file");
    
                rename(__DIR__ . "/_update/$file", "$filePath/$fileName");
            }
        }
        catch (Exception $e)
        {
            Essentials::Error($e);
        }
    }
}