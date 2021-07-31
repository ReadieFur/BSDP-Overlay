<?php
require_once __DIR__ . '/../../api/github/cloner/clone.php';
require_once __DIR__ . '/../../api/essentials.php';

global $payload;

if ($payload->head_commit !== null)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.github.com/repos/' . $payload->repository->owner->login . '/' . $payload->repository->name . '/branches');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('User-Agent: ' . $payload->repository->owner->login));
    $branches = json_decode(curl_exec($ch));
    curl_close($ch);
    foreach ($branches as $branch)
    {
        if ($branch->commit->sha === $payload->head_commit->id && $branch->name === 'closed-beta')
        {
            GitCloner::CloneFiles($payload->repository->owner->login, $payload->repository->name, $branch->name, $payload->head_commit->added, __DIR__ . '/_update');
            GitCloner::CloneFiles($payload->repository->owner->login, $payload->repository->name, $branch->name, $payload->head_commit->modified, __DIR__ . '/_update');
            
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

            break;
        }
    }
}

function MoveFiles($files)
{
    foreach ($files as $file)
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
    
            rename(__DIR__ . "/_update/$file", "$filePath/$fileName");
        }
    }
}