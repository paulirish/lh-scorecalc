#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="none"
CORRECT_NAME="Paul Irish"
CORRECT_EMAIL="commits@paul.irish"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' a5b7254bc3cdc7dc50b49b3d86c153614d183a82...91f7df52bf211c99b164e8b2f56221f074a85fa9