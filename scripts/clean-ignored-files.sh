#!/usr/bin/env bash

if [[ `git status --porcelain` ]]; then
  # Changes
  echo -e $'\n\e[1;41m\e[1;37m ERROR \e[0m\e[1;31m Cannot proceed: untracked and uncommited files found \e[0m\n'
  exit 1
else
  echo -e $'\n\e[1;34mfetching directories/files matching .gitignore...\e[0m'
  git clean -xfdn

  if [[ `git clean -xfdn` ]]; then

      echo -e $'\n\e[1;34mDo you want to proceed? (Y/n)\e[0m'
	  read yn

		if [[ $yn == 'Y' ]]; then
		  git clean -xfd
		  echo -e $'\n\e[1;34mdone!\e[0m 🎉'
		  exit
		else
		  echo -e $'\n\e[1;34mcancelled\e[0m'
		  exit
		fi
  else
	echo -e $'\e[1;34mNo files found!\e[0m'
	exit
  fi

fi
