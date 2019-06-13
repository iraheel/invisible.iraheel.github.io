//
//  ClientSession.swift
//  TrustScience
//
//  Created by Wang Jinghan on 10/3/19.
//  Copyright © 2019 TrustScience. All rights reserved.
//

import UIKit
import TrustScienceUI
import TrustScienceCore

protocol ClientSessionDelegate {
    func clientSessionDidEnd(_ session: ClientSession)
}

class ClientSession {
    
    var delegate: ClientSessionDelegate? = nil
    
    // MARK: - Managers
    private let managers: [Manager]
    
    private let managerUI: UIManager
    private let managerLaunch: LaunchManager
    
    let factoryUI: UIFactory
    
    // MARK: -
    
    init(window: UIWindow) {
        // Managers
        var managers = [Manager]()
        
        managerUI = UIManager(window: window)
        managers.append(managerUI)
        
        managerLaunch = LaunchManager()
        managers.append(managerLaunch)
        
        let deps = UIFactory.Dependencies(
            managerUI: managerUI
        )
        
        factoryUI = UIFactory(deps: deps)
        
        self.managers = managers
    }
    
    func start() {
        let type = managerLaunch.launchType()
        managerUI.launch(type: type)
    }
    
}
