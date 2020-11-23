let prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("navbar").classList.add("hide-navbar");
        document.getElementById("unordered").classList.add("unordered-class");
        document.getElementById("navbar").classList.remove("show-navbar");
    } else {
        document.getElementById("navbar").classList.add("show-navbar");
        document.getElementById("navbar").classList.remove("hide-navbar");
        document.getElementById("unordered").classList.remove("unordered-class");
    }
    prevScrollpos = currentScrollPos;
}


const repo_title = document.getElementById("repo-title");
const access_token = 'c2132a8e-bef62-436af35bd17fe4dd1e86-ff6a476-'
const oAuth = `bearer ${access_token}`;
fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
        Authorization: oAuth.replaceAll('-', '')
    },
    body: JSON.stringify({
        variables: {
            "username": "princess-jewel",
            "count": 20
        },
        query: `query($username: String!, $count: Int!) {
                repositoryOwner(login: $username) {
                    ... on User {
                    name
                    avatarUrl
                    bio
                    login
                    repositories(last: $count) {
                        totalCount
                        edges {
                        node {
                            name
                            description
                            url
                            stargazerCount
                            primaryLanguage {
                            name
                            color
                            }
                            forkCount
                            updatedAt
                        }
                        }
                    }
                    }
                }
            }`
    })
}).then(res => {
    if (res.ok) {
        return res.json();
    } else {
        if (res.status == 401) {
            throw new Error("Auth Token is invalid. Please generate a new one.");
        }
        throw new Error("Something went wrong.");
    }
}).then(data => {
    document.getElementById("dp").src = data.data.repositoryOwner.avatarUrl;
    document.getElementById("dp2").src = data.data.repositoryOwner.avatarUrl;
    document.getElementById("login").innerHTML = data.data.repositoryOwner.login;
    document.getElementById("username").innerHTML = data.data.repositoryOwner.name;
    let response = data.data.repositoryOwner.repositories.edges.reverse().map(repo => {
        // repo_title.innerText = repo.node.name
        let updated_at = new Date(repo.node.updatedAt);
        return `
            <div class="left-col">
                <p><span id="repo-title">${repo.node.name }</span></p>
                <p>${repo.node.description ?? ''}</p>
                <i class="far fa-star star">Star</i>
                <ul>
                    <li style"display: ${repo.node.primaryLanguage == null ? "none;" : "block"}><i class="fas fa-circle" style="color: ${repo.node.primaryLanguage == null ? "#fff; display: none;" : repo.node.primaryLanguage.color}"></i>${repo.node.primaryLanguage == null ? "" : repo.node.primaryLanguage.name}</li>
                    <li><i class="far fa-star"></i>${repo.node.stargazerCount}</li>
                    <li><i class="fas fa-code-branch"></i>${repo.node.forkCount}</li>
                    <li><p>Updated on ${updated_at.toLocaleString(undefined, {month: "short", day: "numeric"})}</p></li>
                </ul>
            </div>`
    })
    document.querySelector('#repoCount').innerHTML = data.data.repositoryOwner.repositories.totalCount
    document.querySelector('.flex-col').innerHTML = response.join('\n');
}).catch(err => {
    alert(err)
})

function myFunction() {
    let x = document.getElementById("navbar");
    if (x.className === "topNavbar") {
        x.className += " responsive";
    } else {
        x.className = "topNavbar";
    }
}